import React, { useEffect, useState } from 'react'
import { BarChart2, Target, Crosshair, Activity, Layers } from 'react-feather'
import { getModelInfo } from '../services/api'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-xl font-extrabold text-slate-950">{value}</p>
      </div>
    </div>
  )
}

function DashboardStats() {
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
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg shadow-indigo-200">
          <BarChart2 size={20} strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
            Model Overview
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Live metrics from the deployed prediction model
          </p>
        </div>
      </div>

      {loading && (
        <p className="text-sm font-medium text-slate-500">Loading model info...</p>
      )}

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-700">
          Could not load model info: {error}. Make sure the backend server is running.
        </div>
      )}

      {info && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={Layers} label="Model Type" value={info.model_type} />
          <StatCard
            icon={Target}
            label="Accuracy"
            value={`${(info.metrics.accuracy * 100).toFixed(1)}%`}
          />
          <StatCard
            icon={Crosshair}
            label="Precision"
            value={`${(info.metrics.precision * 100).toFixed(1)}%`}
          />
          <StatCard
            icon={Activity}
            label="Recall"
            value={`${(info.metrics.recall * 100).toFixed(1)}%`}
          />
          <StatCard
            icon={BarChart2}
            label="F1 Score"
            value={`${(info.metrics.f1_score * 100).toFixed(1)}%`}
          />
        </div>
      )}
    </section>
  )
}

export default DashboardStats
