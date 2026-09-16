# Employee Attrition Prediction

A machine learning project that predicts whether an employee is likely to leave a company, served through a REST API.

Built for the Machine Learning Module Group Project.

---

## Problem

Employee attrition is costly for organisations — replacing a departing employee means recruitment costs, training time, and lost productivity. This project predicts attrition risk **before** an employee resigns, so HR teams can act early with retention measures (salary review, promotion, workload adjustment).

This is a **binary classification** problem: the target `Attrition` is either `Yes` (employee leaves) or `No` (employee stays).

---

## Dataset

| | |
|---|---|
| **Source** | IBM HR Analytics Employee Attrition & Performance (Kaggle) |
| **File** | `data/WA_Fn-UseC_-HR-Employee-Attrition.csv` |
| **Records** | 1,470 |
| **Original features** | 35 |
| **Target variable** | `Attrition` (Yes / No) |
| **Missing values** | None |
| **Duplicate records** | None |

### Data quality issues found

- **Class imbalance** — roughly 16% `Yes` vs 84% `No`. This is the main issue and drove our choice of evaluation metric.
- **Constant columns** — `EmployeeCount`, `StandardHours`, and `Over18` hold a single value for every row and carry no predictive information.
- **Identifier column** — `EmployeeNumber` is an ID, not a feature.
- **Skewed distribution** — `MonthlyIncome` is right-skewed with high-end outliers.

### Feature types

- **Numerical** — `Age`, `DailyRate`, `DistanceFromHome`, `HourlyRate`, `MonthlyIncome`, `MonthlyRate`, `NumCompaniesWorked`, `PercentSalaryHike`, `TotalWorkingYears`, `TrainingTimesLastYear`, `YearsAtCompany`, `YearsInCurrentRole`, `YearsSinceLastPromotion`, `YearsWithCurrManager`
- **Ordinal (1–5 scales)** — `Education`, `EnvironmentSatisfaction`, `JobInvolvement`, `JobLevel`, `JobSatisfaction`, `PerformanceRating`, `RelationshipSatisfaction`, `StockOptionLevel`, `WorkLifeBalance`
- **Categorical** — `BusinessTravel`, `Department`, `EducationField`, `Gender`, `JobRole`, `MaritalStatus`, `OverTime`

---

## Feature engineering

Six techniques were applied, all in `notebooks/data_understanding.ipynb`:

| # | Technique | What we did | Why |
|---|---|---|---|
| 1 | **Removing irrelevant features** | Dropped `EmployeeCount`, `StandardHours`, `Over18`, `EmployeeNumber` | Constant or identifier columns add noise without signal |
| 2 | **Creating new features** | `TenurePerCompany`, `IncomePerYearAtCompany`, `PromotionGap` | Ratios capture career stability and stagnation better than raw counts |
| 3 | **Binning** | `AgeGroup` (18–25, 26–35, 36–45, 46–60) and `IncomeGroup` (quartile-based: Low / Medium / High / Very High) | EDA showed attrition clusters in younger and lower-income bands |
| 4 | **Outlier treatment** | IQR clipping on `MonthlyIncome` | Reduces the pull of extreme salaries on the model |
| 5 | **Encoding categorical variables** | `LabelEncoder` on all categorical columns; target mapped to 0/1 | Models require numeric input |
| 6 | **Feature scaling** | `StandardScaler` fitted on the training split only | Logistic Regression is distance-sensitive; fitting on train only avoids data leakage |

**New feature definitions:**

```
TenurePerCompany       = YearsAtCompany / (NumCompaniesWorked + 1)
IncomePerYearAtCompany = MonthlyIncome / (YearsAtCompany + 1)
PromotionGap           = YearsAtCompany - YearsSinceLastPromotion
```

After engineering, the model uses **35 features**.

---

## Models

Three classification algorithms were trained on an 80/20 stratified train/test split and compared.

| Model | Accuracy | Precision | Recall | F1 |
|---|---|---|---|---|
| **XGBoost** ✅ | 0.850 | 0.538 | 0.447 | **0.488** |
| Logistic Regression | 0.741 | 0.351 | 0.723 | 0.472 |
| Random Forest | 0.823 | 0.368 | 0.149 | 0.212 |

*Precision, recall, and F1 are reported for the positive class (`Attrition = Yes`).*

### Why F1 and not accuracy?

The dataset is imbalanced (~16% `Yes`). A model that predicts `No` for everyone would score ~84% accuracy while being useless — it would never flag a single at-risk employee. F1 balances precision and recall on the minority class, so it reflects whether the model actually finds people who are likely to leave.

### Handling class imbalance

- Logistic Regression and Random Forest → `class_weight="balanced"`
- XGBoost → `scale_pos_weight = (negative samples / positive samples)`

### Why XGBoost was selected

XGBoost achieved the highest F1 score. It handles the non-linear relationships and feature interactions in this dataset well, is a strong performer on structured/tabular data generally, and supports imbalance correction directly through `scale_pos_weight`.

Note that Logistic Regression has higher recall (0.723) — it catches more leavers but raises many more false alarms (precision 0.351). XGBoost gives the better overall trade-off.

---

## Architecture

```
User
 ↓
Frontend Application
 ↓
Backend REST API (FastAPI)
 ↓
ML Prediction Service  ← feature engineering applied to raw input
 ↓
Trained ML Model (XGBoost)
 ↓
Prediction Result
 ↓
Frontend
```

The API replicates the exact feature engineering steps from training — the same bin boundaries, the same encoding maps, the same clipping limits — so that inference matches training conditions.

---

## Project structure

```
Machine-Learning-Project-/
├── api/
│   └── app.py                      # FastAPI application
├── data/
│   └── WA_Fn-UseC_-HR-Employee-Attrition.csv
├── frontend/                       # React + Vite + Tailwind UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── PredictionSection.jsx
│   │   │   ├── DashboardStats.jsx
│   │   │   ├── PerformanceSection.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js              # Calls the FastAPI backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── models/
│   ├── best_model.pkl              # Trained XGBoost model
│   └── scaler.pkl                  # Fitted StandardScaler
├── notebooks/
│   └── data_understanding.ipynb    # EDA, feature engineering, model training
├── Dockerfile
├── requirements.txt
├── sample_request.json
└── README.md
```

---

## Setup

### 1. Clone and enter the project

```bash
git clone https://github.com/ShehanNethsara/Machine-Learning-Project-.git
cd Machine-Learning-Project-
```

### 2. Create a virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the notebook (optional — models are already trained)

```bash
jupyter notebook notebooks/data_understanding.ipynb
```

Running all cells regenerates `models/best_model.pkl` and `models/scaler.pkl`.

### 5. Start the API

```bash
cd api
uvicorn app:app --reload
```

The API runs at `http://127.0.0.1:8000`.

Interactive docs (Swagger UI) are available at `http://127.0.0.1:8000/docs`.

### 6. Start the frontend

In a separate terminal, from the project root:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The backend must already be running at `http://127.0.0.1:8000` — the frontend calls it directly and has no fallback if it's down.

---

## Frontend

A single-page React app (Vite + Tailwind CSS) that gives the model a usable interface, built in `frontend/`.

| Section | Component | What it does |
|---|---|---|
| Navigation | `Navbar.jsx` | Sticky nav with smooth-scroll links to each section, collapses to a mobile menu below `md` |
| Hero | `Hero.jsx` | Introduces the tool and links straight to the prediction form |
| Prediction | `PredictionSection.jsx` | Form covering all 30 model inputs; submits to `POST /predict` and shows the result as "High Attrition Risk" / "Low Attrition Risk" with the probability |
| Live metrics | `DashboardStats.jsx` | Fetches `GET /model-info` on load and displays the model's real accuracy/precision/recall/F1 — not hardcoded, so it always matches whatever model is currently saved |
| Model details | `PerformanceSection.jsx` | Summarises model comparison results and the engineered feature list |
| Footer | `Footer.jsx` | Repo link and project credits |

### Connecting to the backend

All API calls go through `frontend/src/services/api.js`, which points at:

```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

`predictAttrition()`, `getModelInfo()`, and `getHealth()` wrap the three `GET`/`POST` calls and surface backend error messages (including per-field validation errors from `/predict`) as thrown `Error`s that the components catch and display.

If you deploy the API somewhere other than `localhost:8000`, update `API_BASE_URL` in `api.js` before building the frontend.

---

## API documentation

Base URL: `http://127.0.0.1:8000`

### `GET /`

Confirms the API is running.

**Response**

```json
{
  "message": "Employee Attrition Prediction API is running"
}
```

---

### `GET /health`

Health check — reports whether the model and scaler loaded successfully.

**Response**

```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true
}
```

---

### `GET /model-info`

Returns model type, feature list, and test-set metrics.

**Response**

```json
{
  "model_type": "XGBClassifier",
  "num_features": 35,
  "features": ["Age", "BusinessTravel", "DailyRate", "..."],
  "metrics": {
    "accuracy": 0.8503,
    "precision": 0.5385,
    "recall": 0.4468,
    "f1_score": 0.4884
  },
  "note": "Metrics computed on the held-out test set (20% split, stratified)."
}
```

---

### `POST /predict`

Predicts attrition for a single employee.

**Request body**

All 30 fields are required.

| Field | Type | Allowed values / range |
|---|---|---|
| `Age` | int | 18–60 |
| `BusinessTravel` | string | `Non-Travel`, `Travel_Rarely`, `Travel_Frequently` |
| `DailyRate` | int | ≥ 0 |
| `Department` | string | `Sales`, `Research & Development`, `Human Resources` |
| `DistanceFromHome` | int | 0–100 |
| `Education` | int | 1–5 |
| `EducationField` | string | `Life Sciences`, `Other`, `Medical`, `Marketing`, `Technical Degree`, `Human Resources` |
| `EnvironmentSatisfaction` | int | 1–4 |
| `Gender` | string | `Male`, `Female` |
| `HourlyRate` | int | ≥ 0 |
| `JobInvolvement` | int | 1–4 |
| `JobLevel` | int | 1–5 |
| `JobRole` | string | `Sales Executive`, `Research Scientist`, `Laboratory Technician`, `Manufacturing Director`, `Healthcare Representative`, `Manager`, `Sales Representative`, `Research Director`, `Human Resources` |
| `JobSatisfaction` | int | 1–4 |
| `MaritalStatus` | string | `Single`, `Married`, `Divorced` |
| `MonthlyIncome` | float | ≥ 0 |
| `MonthlyRate` | int | ≥ 0 |
| `NumCompaniesWorked` | int | ≥ 0 |
| `OverTime` | string | `Yes`, `No` |
| `PercentSalaryHike` | int | 0–100 |
| `PerformanceRating` | int | 1–4 |
| `RelationshipSatisfaction` | int | 1–4 |
| `StockOptionLevel` | int | 0–3 |
| `TotalWorkingYears` | int | ≥ 0 |
| `TrainingTimesLastYear` | int | ≥ 0 |
| `WorkLifeBalance` | int | 1–4 |
| `YearsAtCompany` | int | ≥ 0 |
| `YearsInCurrentRole` | int | ≥ 0 |
| `YearsSinceLastPromotion` | int | ≥ 0 |
| `YearsWithCurrManager` | int | ≥ 0 |

**Example request**

```json
{
  "Age": 35,
  "BusinessTravel": "Travel_Rarely",
  "DailyRate": 800,
  "Department": "Research & Development",
  "DistanceFromHome": 5,
  "Education": 3,
  "EducationField": "Life Sciences",
  "EnvironmentSatisfaction": 3,
  "Gender": "Male",
  "HourlyRate": 60,
  "JobInvolvement": 3,
  "JobLevel": 2,
  "JobRole": "Research Scientist",
  "JobSatisfaction": 4,
  "MaritalStatus": "Married",
  "MonthlyIncome": 5000,
  "MonthlyRate": 15000,
  "NumCompaniesWorked": 2,
  "OverTime": "No",
  "PercentSalaryHike": 14,
  "PerformanceRating": 3,
  "RelationshipSatisfaction": 3,
  "StockOptionLevel": 1,
  "TotalWorkingYears": 10,
  "TrainingTimesLastYear": 3,
  "WorkLifeBalance": 3,
  "YearsAtCompany": 5,
  "YearsInCurrentRole": 3,
  "YearsSinceLastPromotion": 1,
  "YearsWithCurrManager": 3
}
```

**Success response — `200 OK`**

```json
{
  "prediction": "No",
  "attrition_probability": 0.0092
}
```

`prediction` is `Yes` or `No`. `attrition_probability` is the model's probability that the employee leaves, between 0 and 1.

**Validation error — `422 Unprocessable Entity`**

```json
{
  "error": "Invalid input data",
  "details": [
    {
      "field": "Age",
      "message": "Input should be less than or equal to 60"
    }
  ]
}
```

**Server error — `500 Internal Server Error`**

```json
{
  "error": "Internal server error",
  "details": "..."
}
```

---

## Testing the API

### curl (macOS / Linux)

```bash
curl -X POST http://127.0.0.1:8000/predict \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

### curl (Windows CMD)

```cmd
curl -X POST http://127.0.0.1:8000/predict -H "Content-Type: application/json" -d @sample_request.json
```

### Health and model info

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/model-info
```

### Postman

1. Method `POST`, URL `http://127.0.0.1:8000/predict`
2. **Body** → **raw** → **JSON**
3. Paste the example request above
4. **Send**

### Swagger UI

Open `http://127.0.0.1:8000/docs`, expand `POST /predict`, click **Try it out**, edit the JSON, and click **Execute**.

### Test cases

| Case | Input change | Expected |
|---|---|---|
| Low-risk employee | Example request as-is | `"prediction": "No"`, low probability |
| High-risk employee | `OverTime: "Yes"`, `JobSatisfaction: 1`, `EnvironmentSatisfaction: 1`, `Age: 25`, `MonthlyIncome: 2000`, `YearsAtCompany: 1`, `JobLevel: 1`, `MaritalStatus: "Single"`, `BusinessTravel: "Travel_Frequently"` | `"prediction": "Yes"`, high probability |
| Out-of-range value | `Age: 99` | `422` with a message naming the `Age` field |
| Invalid category | `OverTime: "Maybe"` | `422` with a message naming the `OverTime` field |
| Missing field | Remove `Age` | `422` with a message naming the `Age` field |

---

## Team

| Member | Contribution |
|---|---|
| Shehan Nethsara | Data understanding, EDA, feature engineering |
| Yashodha Gunawardhana | Data preprocessing, encoding, train/test split, scaling |
| Yehara Nessilu | Model training and evaluation, API prediction service |

Each member's contributions are visible in the repository commit history.
