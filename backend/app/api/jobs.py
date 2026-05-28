from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.database.core import get_db
from app.models.schema import Job, User, RoleEnum, RecruiterProfile
from app.schemas.jobs import JobCreate, JobResponse
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.post("/", response_model=JobResponse)
async def create_job(job: JobCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != RoleEnum.recruiter:
        raise HTTPException(status_code=403, detail="Only recruiters can create jobs")
        
    result = await db.execute(select(RecruiterProfile).where(RecruiterProfile.user_id == current_user.id))
    profile = result.scalars().first()
    
    if not profile:
        raise HTTPException(status_code=400, detail="Recruiter profile not found")
        
    new_job = Job(
        recruiter_id=profile.id,
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        status=job.status
    )
    db.add(new_job)
    await db.commit()
    await db.refresh(new_job)
    return new_job

@router.get("/", response_model=List[JobResponse])
async def get_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job))
    return result.scalars().all()
