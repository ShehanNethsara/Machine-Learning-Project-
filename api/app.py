from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


# Load trained model and scaler
model = joblib.load(MODEL_DIR / "best_model.pkl")
scaler = joblib.load(MODEL_DIR / "scaler.pkl")


# FastAPI application
app = FastAPI(
    title="Employee Attrition Prediction API",
    description="API for predicting employee attrition",
    version="1.0.0"
)


# Input data model
class EmployeeData(BaseModel):
    Age: int
    BusinessTravel: str
    DailyRate: int
    Department: str
    DistanceFromHome: int
    Education: int
    EducationField: str
    EnvironmentSatisfaction: int
    Gender: str
    HourlyRate: int
    JobInvolvement: int
    JobLevel: int
    JobRole: str
    JobSatisfaction: int
    MaritalStatus: str
    MonthlyIncome: float
    MonthlyRate: int
    NumCompaniesWorked: int
    OverTime: str
    PercentSalaryHike: int
    PerformanceRating: int
    RelationshipSatisfaction: int
    StockOptionLevel: int
    TotalWorkingYears: int
    TrainingTimesLastYear: int
    WorkLifeBalance: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsSinceLastPromotion: int
    YearsWithCurrManager: int


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "Employee Attrition Prediction API is running"
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