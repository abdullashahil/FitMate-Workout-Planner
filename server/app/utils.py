from datetime import date, timedelta
from typing import List, Dict, Any


def generate_dates(
    start_date: date,
    session_count: int = 12,
    weekdays: List[int] = [0, 2, 4]
) -> List[str]:
    """
    Generate `session_count` ISO dates starting from `start_date`
    """
    dates = []
    d = start_date
    while d.weekday() not in weekdays:
        d += timedelta(days=1)

    idx = 0
    while len(dates) < session_count:
        # cycle through weekdays

        weekday = weekdays[idx % len(weekdays)]
        week_offset = (idx // len(weekdays)) * 7
        base = start_date + timedelta(days=week_offset)
        delta = (weekday - base.weekday() + 7) % 7
        session_date = base + timedelta(days=delta)
        dates.append(session_date.isoformat())
        idx += 1

    return dates


def apply_progression(sessions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    for i, session in enumerate(sessions):
        week = i // 3 
        main_exs = session.get("sections", {}).get("main", [])
        for ex in main_exs:
            reps = ex.get("reps")
            if isinstance(reps, int):
                ex["reps"] = min(reps + week, 15)

            sets = ex.get("sets")
            if isinstance(sets, int) and week >= 1:
                ex["sets"] = min(sets + 1, 5)

    return sessions
