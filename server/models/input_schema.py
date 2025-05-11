from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class UserProfile(BaseModel):
    name: str = Field(..., min_length=1)
    age: int = Field(..., gt=0, lt=100)
    gender: str
    goal: str
    experience: str
    equipment: List[str] = Field(..., min_items=1)
    days_per_week: int = Field(..., ge=1, le=7)
    custom_section_type: Optional[Literal["circuit", "superset"]] = None

class Exercise(BaseModel):
    name: str
    sets: Optional[int] = None
    reps: Optional[int] = None
    duration: Optional[str] = None
    rest: Optional[str] = None
    tempo: Optional[str] = None

class SessionSection(BaseModel):
    warmup: List[Exercise]
    main: List[Exercise]
    cooldown: List[Exercise]
    custom: Optional[List[Exercise]] = None 

class WorkoutSession(BaseModel):
    session: int
    date: str
    sections: SessionSection

class WorkoutPlan(BaseModel):
    user: str
    plan: List[WorkoutSession]