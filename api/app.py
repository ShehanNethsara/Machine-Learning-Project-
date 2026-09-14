from pathlib import Path

import joblib
from fastapi import FastAPI


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# Load trained model and scaler
model = joblib.load(MODEL_DIR / "best_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")


# Create FastAPI application
app = FastAPI(
    title="Employee Attrition Prediction API",
    description="API for predicting employee attrition",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Employee Attrition Prediction API is running"
    }