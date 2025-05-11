import pandas as pd
from datetime import datetime, timedelta
from typing import List, Optional

from models.input_schema import (
    UserProfile,
    WorkoutSession,
    Exercise,
    SessionSection,
    WorkoutPlan,
)


def load_exercise_data() -> pd.DataFrame:
    """Load and clean exercise data from CSV with fallback for missing values."""
    try:
        df = pd.read_csv("data/exercises.csv")
        df.replace(['', 'nan', 'NaN', 'NAN'], None, inplace=True)
        return df.fillna('')
    except Exception as e:
        raise ValueError(f"Error loading exercise data: {str(e)}")


def filter_exercises(
    df: pd.DataFrame,
    section_type: str,
    profile: UserProfile,
    count: int,
    focus: Optional[str] = None
) -> List[dict]:
    """
    Filter exercises based on section, user's experience, and equipment.
    If focus is 'push' or 'pull' and column exists, filter accordingly.
    """
    try:
        mask = (
            (df['type'] == section_type)
            & ((df['level'] == profile.experience) | (df['level'] == 'all'))
            & ((df['equipment'].isin(profile.equipment)) | (df['equipment'] == 'none'))
        )
        # Only apply focus filter if column exists
        if focus in ('push', 'pull') and 'focus' in df.columns:
            mask &= df['focus'] == focus
        eligible = df[mask]
        return eligible.sample(min(count, len(eligible))).to_dict('records')
    except Exception as e:
        raise ValueError(f"Error filtering exercises for {section_type}: {str(e)}")


def safe_int(value) -> Optional[int]:
    """Convert a value to int safely, return None if not possible."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


def create_exercise(
    data: dict,
    overload_reps: int,
    overload_sets: int
) -> Exercise:
    """
    Build Exercise with progressive overload applied.
    """
    base_sets = safe_int(data.get('sets')) or 1
    base_reps = safe_int(data.get('reps')) or 10

    # apply progressive overload
    sets = min(base_sets + overload_sets, base_sets + 2)
    reps = min(base_reps + overload_reps, base_reps + 5)

    ex_type = data.get('type', '').strip().lower()
    return Exercise(
        name=str(data.get('name', '')).strip(),
        sets=sets,
        reps=reps,
        duration=str(data.get('duration', '')).strip() or None,
        rest="60s" if ex_type == "main" else None,
        tempo="2-1-1" if ex_type == "main" else None,
    )


def build_session_sections(
    df: pd.DataFrame,
    profile: UserProfile,
    session_num: int,
    overload_reps: int,
    overload_sets: int
) -> SessionSection:
    """Assemble warmup/main/cooldown/custom for a session."""
    focus = 'push' if session_num % 2 == 1 else 'pull'
    sections = {
        'warmup': [
            create_exercise(e, 0, 0)
            for e in filter_exercises(df, 'warmup', profile, 2)
        ],
        'main': [
            create_exercise(e, overload_reps, overload_sets)
            for e in filter_exercises(df, 'main', profile, 3, focus)
        ],
        'cooldown': [
            create_exercise(e, 0, 0)
            for e in filter_exercises(df, 'cooldown', profile, 2)
        ],
    }

    if profile.custom_section_type and session_num % 3 == 0:
        custom = [
            create_exercise(e, overload_reps, overload_sets)
            for e in filter_exercises(df, 'main', profile, 3, focus)
        ]
        rest_time = "30s" if profile.custom_section_type == "circuit" else "60s"
        for ex in custom:
            ex.rest = rest_time
        sections['custom'] = custom

    return SessionSection(**sections)


def generate_workout_plan(profile: UserProfile) -> WorkoutPlan:
    """Generate 12-session plan with overload and push/pull alternation."""
    df = load_exercise_data()
    sessions: List[WorkoutSession] = []
    current_date = datetime.today()
    interval = max(1, 7 // profile.days_per_week)

    for n in range(1, 13):
        overload_reps = n - 1
        overload_sets = (n - 1) // 4

        sections = build_session_sections(df, profile, n, overload_reps, overload_sets)
        sessions.append(WorkoutSession(
            session=n,
            date=current_date.strftime('%Y-%m-%d'),
            sections=sections
        ))
        current_date += timedelta(days=interval)

    return WorkoutPlan(user=profile.name, plan=sessions)