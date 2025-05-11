import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

def generate_pdf(workout_plan: list, filename: str) -> str:
    """
    Generates a workout plan PDF and returns the file path.

    Args:
        workout_plan (list): List of sessions with sections and exercises.
        filename (str): Output filename (e.g., "123abc_workout.pdf").

    Returns:
        str: Path to the saved PDF.
    """
    # Ensure static directory exists
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
            # If exercises is None, set it as an empty list
            if exercises is None:
                exercises = []
                print(f"Section '{section_name}' has no exercises. Using empty list.")  # Debugging line

            if isinstance(exercises, list):  # Ensure exercises is a list
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
            else:
                print(f"Skipping section {section_name} because 'exercises' is not a list")  # Debugging line

        y -= 20  # Spacing between sessions
        if y < 80:
            c.showPage()
            c.setFont("Helvetica", 12)
            y = height - inch


    c.save()
    return pdf_filepath
