import React from 'react'
import { Cpu, GitHub } from 'react-feather'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-white">
              <Cpu size={16} strokeWidth={2.2} />
            </div>
            <span className="text-sm font-bold text-slate-800">HR Analytics</span>
          </div>

          <p className="text-xs font-medium text-slate-500">
            &copy; {year} Employee Attrition Prediction &mdash; Machine Learning Group Project
          </p>

          <a
            
            href="https://github.com/ShehanNethsara/Machine-Learning-Project-"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
            >
            <GitHub size={14} />
            View on GitHub
            </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer