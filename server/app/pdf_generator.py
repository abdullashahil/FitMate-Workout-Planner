from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet


def generate_pdf(plan: list[dict]) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    story = []

    for session in plan:
        story.append(Paragraph(f"Session {session['session']} — {session['date']}", styles['Heading2']))
        for section_name, exercises in session.get("sections", {}).items():
            if exercises:
                story.append(Paragraph(section_name.capitalize(), styles['Heading3']))
                for ex in exercises:
                    line = ex.get("name", "")
                    if ex.get("sets") and ex.get("reps"):
                        line += f": {ex['sets']}×{ex['reps']}"
                    if ex.get("duration"):
                        line += f" ({ex['duration']})"
                    story.append(Paragraph(line, styles['BodyText']))
                story.append(Spacer(1, 12))
        story.append(Spacer(1, 24))

    doc.build(story)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf