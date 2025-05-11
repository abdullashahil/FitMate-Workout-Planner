import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

def generate_pdf(workout_plan: list, filename: str) -> str:
    os.makedirs("static", exist_ok=True)
    pdf_filepath = os.path.join("static", filename)

    c = canvas.Canvas(pdf_filepath, pagesize=letter)
    width, height = letter
    y = height - inch

    c.setFont("Helvetica-Bold", 14)
    c.drawString(100, y, "Workout Plan")
    y -= 30
    c.setFont("Helvetica", 12)

    for session in workout_plan:
        session_title = f"Session {session['session']} - {session['date']}"
        c.drawString(100, y, session_title)
        y -= 20

        for section_name, exercises in session.get("sections", {}).items():
            if exercises is None:
                exercises = []

            if isinstance(exercises, list): 
                c.drawString(100, y, f"{section_name.capitalize()}:")
                y -= 20

                for exercise in exercises:
                    detail = f"• {exercise['name']}"
                    if 'sets' in exercise and 'reps' in exercise:
                        detail += f" ({exercise['sets']} sets, {exercise['reps']} reps)"
                    elif 'sets' in exercise and 'duration' in exercise:
                        detail += f" ({exercise['sets']} sets, {exercise['duration']})"
                    elif 'duration' in exercise:
                        detail += f" ({exercise['duration']})"

                    c.drawString(120, y, detail)
                    y -= 15

                    if y < 80:
                        c.showPage()
                        c.setFont("Helvetica", 12)
                        y = height - inch

                y -= 10

        y -= 20
        if y < 80:
            c.showPage()
            c.setFont("Helvetica", 12)
            y = height - inch


    c.save()
    return pdf_filepath
