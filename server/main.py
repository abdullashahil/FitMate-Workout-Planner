# workout_generator/main.py
from fastapi import FastAPI, HTTPException, Body
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware

from models.input_schema import UserProfile, WorkoutPlan
from utils.generator import generate_workout_plan
import logging
import traceback
import tempfile
import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from utils.pdf_generator import generate_pdf 
import uuid

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Workout Plan Generator API")
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def universal_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "message": "Internal server error",
            "detail": str(exc),
        },
    )

@app.get("/")
def home():
    return {"message": "Welcome to the AI Workout Plan Generator API!"}

@app.post("/generate", response_model=WorkoutPlan)
def create_plan(profile: UserProfile):
    try:
        logger.info(f"Generating plan for {profile.name}")
        plan = generate_workout_plan(profile)
        return plan
    except Exception as e:
        logger.error(f"Error generating plan: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export")
def export_workout(plan_obj: dict = Body(...)):
    try:
        # Generate a unique filename for each export
        filename = f"{uuid.uuid4().hex}_workout_plan.pdf"
        pdf_path = generate_pdf(plan_obj["plan"], filename)
        return FileResponse(path=pdf_path, filename=filename, media_type="application/pdf")
    except Exception as e:
        logger.error(f"Failed to export workout plan: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to export PDF")
