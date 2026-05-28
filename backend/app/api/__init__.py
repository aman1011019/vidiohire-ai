from fastapi import APIRouter
from .auth import router as auth_router
from .profiles import router as profiles_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(profiles_router, prefix="/api/profiles", tags=["Profiles"])
