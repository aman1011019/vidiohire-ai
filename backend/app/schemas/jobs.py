from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.schema import JobStatusEnum

class JobBase(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None
    status: JobStatusEnum = JobStatusEnum.draft

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    recruiter_id: str
    created_at: datetime
    class Config:
        from_attributes = True
