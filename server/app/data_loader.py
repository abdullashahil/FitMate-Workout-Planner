import pandas as pd
import numpy as np

def load_exercises(csv_path: str = "exercises.csv") -> list[dict]:
    df = pd.read_csv(csv_path)
    # Removing Nan to avoid the errors from the grok api response
    df = df.replace({np.nan: None, np.inf: None, -np.inf: None})
    return df.to_dict(orient="records")
