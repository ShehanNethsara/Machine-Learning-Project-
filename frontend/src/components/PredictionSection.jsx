import React, { useState } from 'react'
import { Cpu, AlertCircle, CheckCircle, Loader } from 'react-feather'
import { predictAttrition } from '../services/api'

// Field definitions — must match EmployeeData model in backend/app.py exactly
const fields = [
  { name: 'Age', type: 'number', min: 18, max: 60, default: 30 },
  { name: 'BusinessTravel', type: 'select', options: ['Non-Travel', 'Travel_Rarely', 'Travel_Frequently'] },
  { name: 'DailyRate', type: 'number', min: 0, default: 800 },
  { name: 'Department', type: 'select', options: ['Sales', 'Research & Development', 'Human Resources'] },
  { name: 'DistanceFromHome', type: 'number', min: 0, max: 100, default: 5 },
  { name: 'Education', type: 'number', min: 1, max: 5, default: 3 },
  { name: 'EducationField', type: 'select', options: ['Life Sciences', 'Other', 'Medical', 'Marketing', 'Technical Degree', 'Human Resources'] },
  { name: 'EnvironmentSatisfaction', type: 'number', min: 1, max: 4, default: 3 },
  { name: 'Gender', type: 'select', options: ['Male', 'Female'] },
  { name: 'HourlyRate', type: 'number', min: 0, default: 60 },
  { name: 'JobInvolvement', type: 'number', min: 1, max: 4, default: 3 },
  { name: 'JobLevel', type: 'number', min: 1, max: 5, default: 2 },
  { name: 'JobRole', type: 'select', options: ['Sales Executive', 'Research Scientist', 'Laboratory Technician', 'Manufacturing Director', 'Healthcare Representative', 'Manager', 'Sales Representative', 'Research Director', 'Human Resources'] },
  { name: 'JobSatisfaction', type: 'number', min: 1, max: 4, default: 3 },
  { name: 'MaritalStatus', type: 'select', options: ['Single', 'Married', 'Divorced'] },
  { name: 'MonthlyIncome', type: 'number', min: 0, default: 5000 },
  { name: 'MonthlyRate', type: 'number', min: 0, default: 15000 },
  { name: 'NumCompaniesWorked', type: 'number', min: 0, default: 2 },
  { name: 'OverTime', type: 'select', options: ['Yes', 'No'] },
  { name: 'PercentSalaryHike', type: 'number', min: 0, max: 100, default: 13 },
  { name: 'PerformanceRating', type: 'number', min: 1, max: 4, default: 3 },
  { name: 'RelationshipSatisfaction', type: 'number', min: 1, max: 4, default: 3 },
  { name: 'StockOptionLevel', type: 'number', min: 0, max: 3, default: 1 },
  { name: 'TotalWorkingYears', type: 'number', min: 0, default: 8 },
  { name: 'TrainingTimesLastYear', type: 'number', min: 0, default: 2 },
  { name: 'WorkLifeBalance', type: 'number', min: 1, max: 4, default: 3 },
  { name: 'YearsAtCompany', type: 'number', min: 0, default: 5 },
  { name: 'YearsInCurrentRole', type: 'number', min: 0, default: 3 },
  { name: 'YearsSinceLastPromotion', type: 'number', min: 0, default: 1 },
  { name: 'YearsWithCurrManager', type: 'number', min: 0, default: 3 },
]

const initialState = fields.reduce((acc, field) => {
  acc[field.name] = field.type === 'select' ? field.options[0] : field.default
  return acc
}, {})

function PredictionSection() {
  const [formData, setFormData] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (name, value, type) => {
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'select' ? value : Number(value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const data = await predictAttrition(formData)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      {/* Section header */}
      <div className="mb-10 flex items-center gap-3">
        <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg shadow-indigo-200">
          <Cpu size={20} strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Attrition Prediction
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Enter employee details to predict attrition risk
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <label
                htmlFor={field.name}
                className="text-xs font-bold uppercase tracking-wide text-slate-500"
              >
                {field.name}
              </label>

              {field.type === 'select' ? (
                <select
                  id={field.name}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value, 'select')}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  type="number"
                  min={field.min}
                  max={field.max}
                  value={formData[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value, 'number')}
                  required
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="brand-gradient mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              <Cpu size={18} strokeWidth={2.2} />
              Predict Attrition Risk
            </>
          )}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div
          className={`mt-6 flex items-start gap-4 rounded-2xl border p-6 ${
            result.prediction === 'Yes'
              ? 'border-red-200 bg-red-50'
              : 'border-emerald-200 bg-emerald-50'
          }`}
        >
          {result.prediction === 'Yes' ? (
            <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={24} />
          ) : (
            <CheckCircle className="mt-0.5 shrink-0 text-emerald-600" size={24} />
          )}
          <div>
            <p
              className={`text-lg font-extrabold ${
                result.prediction === 'Yes' ? 'text-red-700' : 'text-emerald-700'
              }`}
            >
              {result.prediction === 'Yes' ? 'High Attrition Risk' : 'Low Attrition Risk'}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Predicted attrition probability:{' '}
              <span className="font-bold">
                {(result.attrition_probability * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={24} />
          <div>
            <p className="text-sm font-bold text-amber-800">Prediction failed</p>
            <p className="mt-1 text-sm font-medium text-amber-700">{error}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default PredictionSection