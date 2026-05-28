import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Text, Integer, Float, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.core import Base
import enum

class RoleEnum(str, enum.Enum):
    candidate = "candidate"
    recruiter = "recruiter"

class JobStatusEnum(str, enum.Enum):
    open = "open"
    closed = "closed"
    draft = "draft"

class AppStatusEnum(str, enum.Enum):
    applied = "applied"
    interviewing = "interviewing"
    rejected = "rejected"
    hired = "hired"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False)
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    company_name = Column(String)
    title = Column(String)
    avatar_url = Column(String)
    
    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("Job", back_populates="recruiter")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True)
    headline = Column(String)
    bio = Column(Text)
    resume_url = Column(String)
    video_url = Column(String)
    avatar_url = Column(String)
    
    # New Fields for Enterprise Profile
    phone = Column(String)
    country = Column(String)
    city = Column(String)
    timezone = Column(String)
    objective = Column(Text)
    ai_intro = Column(Text)
    ats_score = Column(Float)
    profile_strength = Column(Float)
    
    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate")
    
    # Relationships for rich profile
    experiences = relationship("CandidateExperience", back_populates="profile", cascade="all, delete-orphan")
    educations = relationship("CandidateEducation", back_populates="profile", cascade="all, delete-orphan")
    projects = relationship("CandidateProject", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("CandidateCertification", back_populates="profile", cascade="all, delete-orphan")
    achievements = relationship("CandidateAchievement", back_populates="profile", cascade="all, delete-orphan")
    links = relationship("CandidateLink", back_populates="profile", cascade="all, delete-orphan")
    languages = relationship("CandidateLanguage", back_populates="profile", cascade="all, delete-orphan")
    preferences = relationship("CandidatePreference", back_populates="profile", uselist=False, cascade="all, delete-orphan")
    skills = relationship("CandidateSkill", back_populates="profile", cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    recruiter_id = Column(String, ForeignKey("recruiter_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    status = Column(Enum(JobStatusEnum), default=JobStatusEnum.draft)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String, ForeignKey("jobs.id"))
    candidate_id = Column(String, ForeignKey("candidate_profiles.id"))
    status = Column(Enum(AppStatusEnum), default=AppStatusEnum.applied)
    resume_url = Column(String)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    job = relationship("Job", back_populates="applications")
    candidate = relationship("CandidateProfile", back_populates="applications")
    interview = relationship("Interview", back_populates="application", uselist=False)
    ai_report = relationship("AIReport", back_populates="application", uselist=False)

class Interview(Base):
    __tablename__ = "interviews"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.id"), unique=True)
    status = Column(String, default="scheduled") # scheduled, in_progress, completed
    scheduled_at = Column(DateTime)
    ai_score = Column(Float)
    
    application = relationship("Application", back_populates="interview")
    transcripts = relationship("Transcript", back_populates="interview")
    anti_cheat_logs = relationship("AntiCheatLog", back_populates="interview")

class Transcript(Base):
    __tablename__ = "transcripts"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = Column(String, ForeignKey("interviews.id"))
    role = Column(String) # ai or candidate
    text = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    interview = relationship("Interview", back_populates="transcripts")

class AIReport(Base):
    __tablename__ = "ai_reports"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String, ForeignKey("applications.id"), unique=True)
    resume_score = Column(Float)
    interview_score = Column(Float)
    summary = Column(Text)
    pdf_url = Column(String)
    
    application = relationship("Application", back_populates="ai_report")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    title = Column(String)
    message = Column(Text)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    sender_id = Column(String, ForeignKey("users.id"))
    receiver_id = Column(String, ForeignKey("users.id"))
    content = Column(Text)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AntiCheatLog(Base):
    __tablename__ = "anti_cheat_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    interview_id = Column(String, ForeignKey("interviews.id"))
    event_type = Column(String) # tab_switch, focus_loss, exit_fullscreen
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    interview = relationship("Interview", back_populates="anti_cheat_logs")

# ----------------- RICH PROFILE TABLES -----------------

class CandidateExperience(Base):
    __tablename__ = "candidate_experiences"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    start_date = Column(String)
    end_date = Column(String)
    description = Column(Text)
    technologies = Column(String) # Comma separated
    
    profile = relationship("CandidateProfile", back_populates="experiences")

class CandidateEducation(Base):
    __tablename__ = "candidate_educations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    school = Column(String, nullable=False)
    degree = Column(String, nullable=False)
    specialization = Column(String)
    cgpa = Column(String)
    start_year = Column(String)
    end_year = Column(String)
    
    profile = relationship("CandidateProfile", back_populates="educations")

class CandidateProject(Base):
    __tablename__ = "candidate_projects"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    tech_stack = Column(String)
    github_url = Column(String)
    live_url = Column(String)
    role_in_project = Column(String)
    
    profile = relationship("CandidateProfile", back_populates="projects")

class CandidateCertification(Base):
    __tablename__ = "candidate_certifications"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    name = Column(String, nullable=False)
    issuer = Column(String)
    year = Column(String)
    credential_url = Column(String)
    
    profile = relationship("CandidateProfile", back_populates="certifications")

class CandidateAchievement(Base):
    __tablename__ = "candidate_achievements"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    type = Column(String) # e.g. Award, Publication, Hackathon
    
    profile = relationship("CandidateProfile", back_populates="achievements")

class CandidateLink(Base):
    __tablename__ = "candidate_links"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    platform = Column(String, nullable=False) # e.g. LinkedIn, GitHub
    url = Column(String, nullable=False)
    
    profile = relationship("CandidateProfile", back_populates="links")

class CandidateLanguage(Base):
    __tablename__ = "candidate_languages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    language = Column(String, nullable=False)
    proficiency = Column(String) # e.g. Native, Fluent, Beginner
    
    profile = relationship("CandidateProfile", back_populates="languages")

class CandidatePreference(Base):
    __tablename__ = "candidate_preferences"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"), unique=True)
    preferred_role = Column(String)
    expected_salary = Column(String)
    remote_preference = Column(String)
    relocation = Column(Boolean)
    availability = Column(String)
    
    profile = relationship("CandidateProfile", back_populates="preferences")

class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    profile_id = Column(String, ForeignKey("candidate_profiles.id"))
    name = Column(String, nullable=False)
    
    profile = relationship("CandidateProfile", back_populates="skills")
