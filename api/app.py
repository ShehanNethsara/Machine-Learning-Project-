from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
# from fastapi import FastAPI
# from pydantic import BaseModel

from fastapi import FastAPI, Request
from pydantic import BaseModel, Field

# from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
# from pydantic import Field
from sklearn.linear_model import LogisticRegression



# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# Load trained model and scaler
model = joblib.load(MODEL_DIR / "best_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")

# Known model metrics from the training 
MODEL_METRICS = {
    "model_name": type(model).__name__,
    "accuracy": 0.7415,
    "precision": 0.3505,
    "recall": 0.7234,
    "f1_score": 0.4722,
    "note": "Metrics computed on the held-out test set (20% split, stratified).",
}

# FastAPI application
app = FastAPI(
    title="Employee Attrition Prediction API",
    description="API for predicting employee attrition",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input data model
class EmployeeData(BaseModel):
    Age: int = Field(..., ge=18, le=60, description="Employee age")
    BusinessTravel: Literal["Non-Travel", "Travel_Rarely", "Travel_Frequently"]
    DailyRate: int = Field(..., ge=0)
    Department: Literal["Sales", "Research & Development", "Human Resources"]
    DistanceFromHome: int = Field(..., ge=0, le=100)
    Education: int = Field(..., ge=1, le=5)
    EducationField: Literal[
        "Life Sciences", "Other", "Medical", "Marketing",
        "Technical Degree", "Human Resources"
    ]
    EnvironmentSatisfaction: int = Field(..., ge=1, le=4)
    Gender: Literal["Male", "Female"]
    HourlyRate: int = Field(..., ge=0)
    JobInvolvement: int = Field(..., ge=1, le=4)
    JobLevel: int = Field(..., ge=1, le=5)
    JobRole: Literal[
        "Sales Executive", "Research Scientist", "Laboratory Technician",
        "Manufacturing Director", "Healthcare Representative", "Manager",
        "Sales Representative", "Research Director", "Human Resources"
    ]
    JobSatisfaction: int = Field(..., ge=1, le=4)
    MaritalStatus: Literal["Single", "Married", "Divorced"]
    MonthlyIncome: float = Field(..., ge=0)
    MonthlyRate: int = Field(..., ge=0)
    NumCompaniesWorked: int = Field(..., ge=0)
    OverTime: Literal["Yes", "No"]
    PercentSalaryHike: int = Field(..., ge=0, le=100)
    PerformanceRating: int = Field(..., ge=1, le=4)
    RelationshipSatisfaction: int = Field(..., ge=1, le=4)
    StockOptionLevel: int = Field(..., ge=0, le=3)
    TotalWorkingYears: int = Field(..., ge=0)
    TrainingTimesLastYear: int = Field(..., ge=0)
    WorkLifeBalance: int = Field(..., ge=1, le=4)
    YearsAtCompany: int = Field(..., ge=0)
    YearsInCurrentRole: int = Field(..., ge=0)
    YearsSinceLastPromotion: int = Field(..., ge=0)
    YearsWithCurrManager: int = Field(..., ge=0)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [
        {"field": ".".join(str(x) for x in err["loc"][1:]), "message": err["msg"]}
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={"error": "Invalid input data", "details": errors},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "details": str(exc)},
    )

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Employee Attrition Prediction API is running"
    }

@app.get("/health")
def health_check():
    model_ready = model is not None and scaler is not None
    return {
        "status": "healthy" if model_ready else "unhealthy",
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
    }


@app.get("/model-info")
def model_info():
    return {
        "model_type": MODEL_METRICS["model_name"],
        "num_features": len(scaler.feature_names_in_),
        "features": list(scaler.feature_names_in_),
        "metrics": {
            "accuracy": MODEL_METRICS["accuracy"],
            "precision": MODEL_METRICS["precision"],
            "recall": MODEL_METRICS["recall"],
            "f1_score": MODEL_METRICS["f1_score"],
        },
        "note": MODEL_METRICS["note"],
    }

# Prediction endpoint
@app.post("/predict")
def predict_employee_attrition(employee: EmployeeData):

    # Convert input JSON to dictionary
    data = employee.model_dump()

    # Create DataFrame from input data
    df = pd.DataFrame([data])


    ## Feature Engineering

    # Calculate average tenure per company
    df["TenurePerCompany"] = (
        df["YearsAtCompany"] /
        (df["NumCompaniesWorked"] + 1)
    )

    # Calculate income earned per year at the company
    df["IncomePerYearAtCompany"] = (
        df["MonthlyIncome"] /
        (df["YearsAtCompany"] + 1)
    )

    # Calculate the gap since the last promotion
    df["PromotionGap"] = (
        df["YearsAtCompany"] -
        df["YearsSinceLastPromotion"]
    )



    ## Age Group

    # Divide employees into the same age groups used during training
    df["AgeGroup"] = pd.cut(
        df["Age"],
        bins=[17, 25, 35, 45, 60],
        labels=["18-25", "26-35", "36-45", "46-60"]
    )



    ## Income Group

    # Divide MonthlyIncome using the exact quartile boundaries
    # obtained from the training dataset
    df["IncomeGroup"] = pd.cut(
        df["MonthlyIncome"],
        bins=[
            -float("inf"),
            2911,
            4919,
            8379,
            float("inf")
        ],
        labels=[
            "Low",
            "Medium",
            "High",
            "Very High"
        ],
        include_lowest=True
    )


    ## Outlier Treatment

    # Apply the same MonthlyIncome clipping used during training
    df["MonthlyIncome"] = df["MonthlyIncome"].clip(
        lower=-5291.0,
        upper=16581.0
    )


    ## Label Encoding

    # Apply the same LabelEncoder mappings used during training
    mappings = {

        "BusinessTravel": {
            "Non-Travel": 0,
            "Travel_Frequently": 1,
            "Travel_Rarely": 2
        },

        "Department": {
            "Human Resources": 0,
            "Research & Development": 1,
            "Sales": 2
        },

        "EducationField": {
            "Human Resources": 0,
            "Life Sciences": 1,
            "Marketing": 2,
            "Medical": 3,
            "Other": 4,
            "Technical Degree": 5
        },

        "Gender": {
            "Female": 0,
            "Male": 1
        },

        "JobRole": {
            "Healthcare Representative": 0,
            "Human Resources": 1,
            "Laboratory Technician": 2,
            "Manager": 3,
            "Manufacturing Director": 4,
            "Research Director": 5,
            "Research Scientist": 6,
            "Sales Executive": 7,
            "Sales Representative": 8
        },

        "MaritalStatus": {
            "Divorced": 0,
            "Married": 1,
            "Single": 2
        },

        "OverTime": {
            "No": 0,
            "Yes": 1
        },

        "AgeGroup": {
            "18-25": 0,
            "26-35": 1,
            "36-45": 2,
            "46-60": 3
        },

        "IncomeGroup": {
            "High": 0,
            "Low": 1,
            "Medium": 2,
            "Very High": 3
        }
    }

    # Apply encoding mappings to categorical columns
    for column, mapping in mappings.items():
        df[column] = df[column].astype(str).map(mapping)


    
    # Get the exact feature order used when the scaler was fitted
    feature_order = scaler.feature_names_in_

    # Arrange the input features in the same order as training
    X = df[feature_order]

 
    ## Scale features
    # Logistic Regression was trained on scaled data

    if isinstance(model, LogisticRegression):
        X_scaled = scaler.transform(X)
    else:
        X_scaled = X.values

    # Prediction
    prediction = model.predict(X_scaled)[0]
    probability = model.predict_proba(X_scaled)[0][1]


    # Response
    return {
        "prediction": "Yes" if prediction == 1 else "No",
        "attrition_probability": round(float(probability), 4)
    }