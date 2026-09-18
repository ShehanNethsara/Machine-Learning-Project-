import React from 'react'
import { ArrowRight, TrendingUp, Shield, Zap } from 'react-feather'

function Hero({ onGetStarted }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-indigo-50 via-white to-white">
      {/* Decorative background blobs — single brand family, no stray purple/blue mix */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
        <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700">
          <Zap size={14} strokeWidth={2.5} />
          Machine Learning Powered
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
          Predict Employee Attrition{' '}
          <span className="brand-gradient-text">Before It Happens</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-500 sm:text-lg">
          A full-stack ML system that analyzes employee data and predicts attrition
          risk in real time, helping HR teams act early and retain talent.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={onGetStarted}
            className="brand-gradient flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:shadow-xl"
          >
            Try a Prediction
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Feature highlights */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <TrendingUp size={20} strokeWidth={2.2} />
            </div>
            <p className="text-sm font-bold text-slate-800">Data-Driven</p>
            <p className="text-xs font-medium text-slate-500">
              Trained on real HR analytics data
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Zap size={20} strokeWidth={2.2} />
            </div>
            <p className="text-sm font-bold text-slate-800">Instant Results</p>
            <p className="text-xs font-medium text-slate-500">
              Predictions in under a second
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Shield size={20} strokeWidth={2.2} />
            </div>
            <p className="text-sm font-bold text-slate-800">Reliable</p>
            <p className="text-xs font-medium text-slate-500">
              Validated with precision &amp; recall metrics
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
