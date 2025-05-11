
# **AI Intern Assignment – FitMate Workout Plan Generator**

FitMate is a web app that generates personalized workout plans, lets users track sessions, and allows exporting the plan as a PDF.
---

## 🔗 Deployed Link

[Visit FitMate](https://taskified-frontend.netlify.app/)
[Live Web API](https://fitmate-workout-planner.onrender.com/)

## **Key Features:**
- **AI-Generated 12-Session Workout Plan:** The app generates a 12-session workout plan with exercises structured into 3 primary sections: Warm-Up, Main Exercises, and Cool-Down.
- **Custom Section Support:** Optionally, users can add Circuit or Superset as custom sections.
- **Personalized Plans:** Generates plans based on user profiles, including age, gender, fitness goal, and equipment.
- **Progressive Overload:** Logic for progressively increasing sets or reps every week.
- **Export to PDF:** Ability to export the workout plan in either PDF or JSON format.
- **Simple Web API:** A FastAPI-based backend that handles user input and generates workout plans.

---

## **Project Setup**

### **Backend Setup:**
The backend of the project is built with **Python FastAPI**. Here are the instructions to set up the backend:

### **1. Clone the repository:**
```bash
git clone https://github.com/abdullashahil/FitMate-Workout-Planner
cd workout-plan-generator
```

### **2. Install dependencies:**
Make sure you have Python 3.7+ installed, then install the required dependencies by running:
```bash
pip install -r requirements.txt
```

### **3. Environment Variables:**
No specific environment variables are required for the backend, but you may need to configure any API keys if using external services.

### **4. Running the Backend:**
To run the backend locally in development mode:
```bash
uvicorn main:app --reload
```
- The backend will be available at `http://127.0.0.1:8000`.

### **5. API Documentation:**
Once the backend is running, you can view the interactive API documentation provided by FastAPI at:
```plaintext
http://127.0.0.1:8000/docs
```

---

## **Deployed Links:**
- **Frontend URL:** [Add your deployed frontend link here]
- **Backend API URL:** [Add your deployed backend API link here]

---

## **Sample Input JSON:**
The input to generate the workout plan is a user profile in JSON format. Below is a sample input:

```json
{
  "name": "Shahil",
  "age": 28,
  "gender": "male",
  "experience": "intermediate",
  "goal": "muscle gain",
  "days_per_week": 4,
  "equipment": ["dumbbell", "resistance band", "none"],
  "custom_section_type": "circuit"
}

```

---

## **Sample Output Format (Workout Plan):**
The output will be a structured workout plan. Below is a sample output:

```json
{
  "session": 1,
  "date": "2025-05-06",
  "sections": {
    "warmup": [
      { "name": "Jumping Jacks", "duration": "2 min" },
      { "name": "Arm Circles", "sets": 2, "reps": 15 }
    ],
    "main": [
      { "name": "Dumbbell Chest Press", "sets": 3, "reps": 10, "rest": "60s", "tempo": "2-1-1" },
      { "name": "Resistance Band Row", "sets": 3, "reps": 12 }
    ],
    "cooldown": [
      { "name": "Child’s Pose", "duration": "1 min" },
      { "name": "Chest Stretch", "duration": "30 sec each side" }
    ]
  }
}
```

[Web API - documentation](https://fitmate-workout-planner.onrender.com/docs)