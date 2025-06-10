# FitMate Workout Plan Generator

FitMate is a full-stack web application that generates personalized 12-session workout plans via the Groq API, lets users track sessions, and export their plan as a PDF.

---

## Deployed Links

* **Frontend:** [https://fitmate-workout-planner.netlify.app](https://fitmate-workout-planner.netlify.app)
* **Backend (FastAPI):** [https://fitmate-workout-planner.onrender.com](https://fitmate-workout-planner.onrender.com)
* **API Docs:** [https://fitmate-workout-planner.onrender.com/docs](https://fitmate-workout-planner.onrender.com/docs)

---

## Key Features

1. **AI-Generated Workout Plans**

   * 12 sessions, each broken into Warm-Up, Main, and Cool-Down sections.
   * Optional custom sections: Circuit or Superset.
2. **Personalization**

   * Plans tailored based on user profile: age, gender, goal, experience, equipment, days per week.
3. **Progressive Overload**

   * Automatically increases reps or sets week-over-week.
4. **Export Options**

   * Export generated plan as **PDF** via the Download button.
5. **Simple Web API**

   * FastAPI backend handling plan generation and PDF export.

---

## Project Setup

### 1. Clone & Install

```bash
# Clone the repo
git clone https://github.com/abdullashahil/FitMate-Workout-Planner
cd server

# (Optional) Create virtual env
python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` in the root of the `server` folder with your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
```

> **Why?**
> The Groq API is used to generate AI-powered workout plans. Without a valid key, plan generation will fail.

### 3. Running Locally

```bash
uvicorn main:app --reload
```

* Server runs at `http://127.0.0.1:8000`
* Open `http://127.0.0.1:8000/docs` for API docs.

---

## API Endpoints

### 1. Generate Workout Plan

```
POST /generate-plan
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Alice",
  "age": 30,
  "gender": "female",
  "goal": "fat_loss",
  "experience": "beginner",
  "equipment": ["dumbbells","yoga_mat"],
  "days_per_week": 3,
  "custom_section_type": "superset"
}
```

**Response (200):**

```json
{
  "user": "Alice",
  "plan": [
    {
      "session": 1,
      "date": "2025-06-11",
      "sections": { ... }
    },
   ...
  ]
}
```

### 2. Download PDF

```
POST /download-plan
Accept: application/pdf
```

**Request Body:**  Same JSON returned from `/generate-plan`.

**Response (PDF):**  Streams a PDF file for download or in-browser viewing.

---

## Frontend Usage

1. Fill out your profile on the landing page.
2. Click Generate Plan to fetch your personalized plan.
3. Click Download PDF to view/export the plan.