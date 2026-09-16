import React, { useEffect, useState } from 'react'
import { TrendingUp, Info, List } from 'react-feather'
import { getModelInfo } from '../services/api'

function MetricBar({ label, value, color }) {
  const percent = (value * 100).toFixed(1)
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
        <span className="text-sm font-extrabold text-slate-950">{percent}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function PerformanceSection() {
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getModelInfo()
      .then((data) => setInfo(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="performance" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200">
          <TrendingUp size={20} strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Model Performance
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Evaluation results on the held-out test set
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm font-medium text-slate-500">Loading performance data...</p>
      )}

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-700">
          Could not load performance data: {error}. Make sure the backend server is running.
        </div>
      )}

      {info && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Metrics bars */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wide text-slate-500">
              Evaluation Metrics — {info.model_type}
            </h3>
            <div className="flex flex-col gap-5">
              <MetricBar label="Accuracy" value={info.metrics.accuracy} color="bg-blue-500" />
              <MetricBar label="Precision" value={info.metrics.precision} color="bg-purple-500" />
              <MetricBar label="Recall" value={info.metrics.recall} color="bg-emerald-500" />
              <MetricBar label="F1 Score" value={info.metrics.f1_score} color="bg-amber-500" />
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <Info size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <p className="text-xs font-medium leading-relaxed text-slate-500">
                {info.note}
              </p>
            </div>
          </div>

          {/* Feature list */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="mb-4 flex items-center gap-2">
              <List size={16} className="text-slate-400" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Features Used ({info.num_features})
              </h3>
            </div>
            <div className="flex max-h-80 flex-wrap gap-2 overflow-y-auto pr-1">
              {info.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default PerformanceSection