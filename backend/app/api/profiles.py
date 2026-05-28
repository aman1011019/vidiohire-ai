from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.core import get_db
from app.models import schema as models
from app.schemas import profile as schemas
from app.api.auth import get_current_user
from app.services.ai_service import AIService
import uuid

router = APIRouter()

def get_profile_or_404(db: Session, user_id: str):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == user_id).first()
    if not profile:
        profile = models.CandidateProfile(id=str(uuid.uuid4()), user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.get("/me", response_model=schemas.CandidateProfile)
async def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    profile = get_profile_or_404(db, current_user.id)
    return profile

@router.put("/me", response_model=schemas.CandidateProfile)
async def update_my_profile(
    profile_update: schemas.CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    profile = get_profile_or_404(db, current_user.id)
    
    update_data = profile_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
        
    db.commit()
    db.refresh(profile)
    return profile

# Factory for generic sub-resource endpoints (experience, education, projects, etc.)
def register_subresource(router: APIRouter, path: str, model_cls, schema_create, schema_out, profile_attr):
    @router.post(f"/me/{path}", response_model=schema_out)
    async def create_item(
        item: schema_create,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
    ):
        profile = get_profile_or_404(db, current_user.id)
        new_item = model_cls(**item.dict(), profile_id=profile.id)
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

    @router.put(f"/me/{path}/{{item_id}}", response_model=schema_out)
    async def update_item(
        item_id: str,
        item: schema_create,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
    ):
        profile = get_profile_or_404(db, current_user.id)
        db_item = db.query(model_cls).filter(model_cls.id == item_id, model_cls.profile_id == profile.id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Item not found")
            
        for key, value in item.dict(exclude_unset=True).items():
            setattr(db_item, key, value)
            
        db.commit()
        db.refresh(db_item)
        return db_item

    @router.delete(f"/me/{path}/{{item_id}}")
    async def delete_item(
        item_id: str,
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)
    ):
        profile = get_profile_or_404(db, current_user.id)
        db_item = db.query(model_cls).filter(model_cls.id == item_id, model_cls.profile_id == profile.id).first()
        if not db_item:
            raise HTTPException(status_code=404, detail="Item not found")
            
        db.delete(db_item)
        db.commit()
        return {"ok": True}

register_subresource(router, "experiences", models.CandidateExperience, schemas.CandidateExperienceCreate, schemas.CandidateExperience, "experiences")
register_subresource(router, "educations", models.CandidateEducation, schemas.CandidateEducationCreate, schemas.CandidateEducation, "educations")
register_subresource(router, "projects", models.CandidateProject, schemas.CandidateProjectCreate, schemas.CandidateProject, "projects")
register_subresource(router, "certifications", models.CandidateCertification, schemas.CandidateCertificationCreate, schemas.CandidateCertification, "certifications")
register_subresource(router, "achievements", models.CandidateAchievement, schemas.CandidateAchievementCreate, schemas.CandidateAchievement, "achievements")
register_subresource(router, "links", models.CandidateLink, schemas.CandidateLinkCreate, schemas.CandidateLink, "links")
register_subresource(router, "languages", models.CandidateLanguage, schemas.CandidateLanguageCreate, schemas.CandidateLanguage, "languages")
register_subresource(router, "skills", models.CandidateSkill, schemas.CandidateSkillCreate, schemas.CandidateSkill, "skills")

@router.put("/me/preferences", response_model=schemas.CandidatePreference)
async def update_preferences(
    prefs: schemas.CandidatePreferenceCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    profile = get_profile_or_404(db, current_user.id)
    if profile.preferences:
        for key, value in prefs.dict(exclude_unset=True).items():
            setattr(profile.preferences, key, value)
    else:
        new_prefs = models.CandidatePreference(**prefs.dict(), profile_id=profile.id)
        db.add(new_prefs)
    db.commit()
    db.refresh(profile)
    return profile.preferences

@router.post("/me/resume/extract")
async def extract_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    profile = get_profile_or_404(db, current_user.id)
    content = await file.read()
    
    ai_service = AIService()
    try:
        # Fast extraction simulation for demo purposes
        # In a real scenario, this sends content to OpenAI and parses structured JSON.
        result = await ai_service.extract_profile_from_resume(content, file.filename)
        
        # Merge basic text details
        profile.ai_intro = result.get("ai_intro", profile.ai_intro)
        profile.ats_score = result.get("ats_score", 85.0)
        profile.profile_strength = result.get("profile_strength", 90.0)
        db.commit()
        
        return {"ok": True, "extracted_data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
