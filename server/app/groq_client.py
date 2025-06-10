import os
import json
import re
import groq
from dotenv import load_dotenv
from .data_loader import load_exercises
from .models import UserProfile

load_dotenv()

# USING GROK API TO GENERATE SESSIONS - all the json structure and rules have been given in prompt
class GroqWorkoutGenerator:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError("GROQ_API_KEY environment variable missing")
        self.client = groq.Client(api_key=api_key)
        self.model = "llama3-8b-8192"
    
    def _extract_json(self, text: str) -> dict:
        """Extract the first JSON object found in text."""
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # to get the substring between first { and last }
            match = re.search(r"\{.*\}", text, re.DOTALL)
            if match:
                return json.loads(match.group())
            raise ValueError("No valid JSON found in AI response")

    def generate(self, profile: UserProfile) -> list:
        """Generate workout sessions using Groq API."""
        exercises = load_exercises()

        # Convert Pydantic model + exercises to pure JSON strings
        profile_json   = json.dumps(profile.dict())
        exercises_json = json.dumps(exercises)

        prompt = f"""
Create a 12-session workout plan for the following user profile:
{profile_json}

Available Exercises:
{exercises_json}

Rules:
1. Alternate push/pull days
2. Include warmup, main, cooldown
3. Add '{profile.custom_section_type}' section if specified
4. Apply progressive overload weekly
5. Output ONLY JSON with this structure:
{{
  "sessions": [
    {{
      "sections": {{
        "warmup": [{{"name": "...", ...}}],
        "main": [{{"name": "...", ...}}],
        "cooldown": [{{"name": "...", ...}}],
        "custom": [...] 
      }}
    }}
  ]
}}
"""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000
        )
        content = response.choices[0].message.content
        data = self._extract_json(content)
        return data.get("sessions", [])
