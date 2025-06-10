from fastapi import FastAPI, HTTPException, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from .models import UserProfile
from .groq_client import GroqWorkoutGenerator
from .utils import generate_dates, apply_progression
from .pdf_generator import generate_pdf
from datetime import date

app = FastAPI()
origins = ["*"]

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-plan")
async def create_workout_plan(profile: UserProfile):
    try:
        generator = GroqWorkoutGenerator()
        sessions = generator.generate(profile)
        sessions = apply_progression(sessions)

        plan_entries = [
            {
                "session": i + 1,
                "date": dt,
                "sections": session["sections"]
            }
            for i, (dt, session) in enumerate(zip(
                generate_dates(date.today()),
                sessions
            ))
        ]

        # Sort by date
        plan_entries.sort(key=lambda e: e["date"])
        for idx, entry in enumerate(plan_entries, start=1):
            entry["session"] = idx

        return {"user": profile.name, "plan": plan_entries}

    except Exception as e:
        print(f"AI generation failed: {str(e)}")
        raise HTTPException(500, f"AI generation failed: {str(e)}")


@app.post("/download-plan")
async def download_workout_plan(request: Request):
    try:
        body = await request.json()
        # { user: ..., plan: [...] }
        plan_list = body.get("plan", [])
        filename = body.get("user", "workout_plan").replace(" ", "_")

        # Pass to PDF generator
        pdf_bytes = generate_pdf(plan_list)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}.pdf"}
        )
    except Exception as e:
        print(f"PDF generation failed: {str(e)}")
        raise HTTPException(500, f"PDF generation failed: {str(e)}")