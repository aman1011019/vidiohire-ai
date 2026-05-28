from pydantic import BaseModel
from typing import List, Optional

class CandidateExperienceBase(BaseModel):
    company: str
    role: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[str] = None

class CandidateExperienceCreate(CandidateExperienceBase):
    pass

class CandidateExperience(CandidateExperienceBase):
    id: str
    class Config:
        orm_mode = True

class CandidateEducationBase(BaseModel):
    school: str
    degree: str
    specialization: Optional[str] = None
    cgpa: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None

class CandidateEducationCreate(CandidateEducationBase):
    pass

class CandidateEducation(CandidateEducationBase):
    id: str
    class Config:
        orm_mode = True

class CandidateProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    tech_stack: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    role_in_project: Optional[str] = None

class CandidateProjectCreate(CandidateProjectBase):
    pass

class CandidateProject(CandidateProjectBase):
    id: str
    class Config:
        orm_mode = True

class CandidateCertificationBase(BaseModel):
    name: str
    issuer: Optional[str] = None
    year: Optional[str] = None
    credential_url: Optional[str] = None

class CandidateCertificationCreate(CandidateCertificationBase):
    pass

class CandidateCertification(CandidateCertificationBase):
    id: str
    class Config:
        orm_mode = True

class CandidateAchievementBase(BaseModel):
    title: str
    description: Optional[str] = None
    type: Optional[str] = None

class CandidateAchievementCreate(CandidateAchievementBase):
    pass

class CandidateAchievement(CandidateAchievementBase):
    id: str
    class Config:
        orm_mode = True

class CandidateLinkBase(BaseModel):
    platform: str
    url: str

class CandidateLinkCreate(CandidateLinkBase):
    pass

class CandidateLink(CandidateLinkBase):
    id: str
    class Config:
        orm_mode = True

class CandidateLanguageBase(BaseModel):
    language: str
    proficiency: Optional[str] = None

class CandidateLanguageCreate(CandidateLanguageBase):
    pass

class CandidateLanguage(CandidateLanguageBase):
    id: str
    class Config:
        orm_mode = True

class CandidatePreferenceBase(BaseModel):
    preferred_role: Optional[str] = None
    expected_salary: Optional[str] = None
    remote_preference: Optional[str] = None
    relocation: Optional[bool] = None
    availability: Optional[str] = None

class CandidatePreferenceCreate(CandidatePreferenceBase):
    pass

class CandidatePreference(CandidatePreferenceBase):
    id: str
    class Config:
        orm_mode = True

class CandidateSkillBase(BaseModel):
    name: str

class CandidateSkillCreate(CandidateSkillBase):
    pass

class CandidateSkill(CandidateSkillBase):
    id: str
    class Config:
        orm_mode = True

class CandidateProfileBase(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    resume_url: Optional[str] = None
    video_url: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    timezone: Optional[str] = None
    objective: Optional[str] = None

class CandidateProfileUpdate(CandidateProfileBase):
    pass

class CandidateProfile(CandidateProfileBase):
    id: str
    user_id: str
    ai_intro: Optional[str] = None
    ats_score: Optional[float] = None
    profile_strength: Optional[float] = None
    
    experiences: List[CandidateExperience] = []
    educations: List[CandidateEducation] = []
    projects: List[CandidateProject] = []
    certifications: List[CandidateCertification] = []
    achievements: List[CandidateAchievement] = []
    links: List[CandidateLink] = []
    languages: List[CandidateLanguage] = []
    preferences: Optional[CandidatePreference] = None
    skills: List[CandidateSkill] = []
    
    class Config:
        orm_mode = True
