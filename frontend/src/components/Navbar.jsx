import React, { useState } from 'react'
import { Activity, BarChart2, Cpu, Menu, Shield, X } from 'react-feather'

const navigation = [
  { key: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { key: 'prediction', label: 'Prediction', icon: Cpu },
  { key: 'performance', label: 'Performance', icon: Activity },
]

function Navbar({ activeTab, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const go = (key) => {
    onNavigate(key)
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <button
          type="button"
          onClick={() => go('dashboard')}
          className="flex items-center gap-3"
        >
          <div className="brand-gradient flex h-11 w-11 items-center justify-center rounded-xl text-sm font-extrabold text-white shadow-lg shadow-indigo-200">
            HR
          </div>
          <div className="text-left">
            <h1 className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
              HR Analytics
            </h1>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Intelligent Workforce Insights
            </p>
          </div>
        </button>

        {/* Desktop Navigation — tabs, not scroll links */}
        <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => go(item.key)}
                className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600 hover:shadow-sm'
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={2.2}
                  className={isActive ? 'text-indigo-600' : 'group-hover:text-indigo-600'}
                />
                {item.label}
              </button>
            )
          })}
        </div>

        {/* System Status */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-700">ML System Active</span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Shield size={18} strokeWidth={2.2} />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600 md:hidden"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-20 border-t border-slate-200 bg-white px-6 py-4 shadow-lg md:hidden">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.key

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => go(item.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-emerald-700">ML System Active</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
