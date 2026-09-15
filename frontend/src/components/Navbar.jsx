import React, { useState } from 'react'
import { Activity, BarChart2, Cpu, Menu, Shield, X, } from 'react-feather' 

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const navigation = [
    {
      label: 'Dashboard',
      href: '#dashboard',
      icon: BarChart2,
    },
    {
      label: 'Prediction',
      href: '#prediction',
      icon: Cpu,
    },
    {
      label: 'Performance',
      href: '#performance',
      icon: Activity,
    },
  ];


  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

            {/* Brand */}
            <a
                href="#top"
                className="flex items-center gap-3"
                onClick={() => setIsMenuOpen(false)}
            >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-sm font-extrabold text-white shadow-lg shadow-blue-200">
                HR
                </div>

                <div>
                    <h1 className="text-base font-extrabold tracking-tight text-slate-950 sm:text-lg">
                        HR Analytics
                    </h1>

                    <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
                        Intelligent Workforce Insights
                    </p>
                </div>
            </a>


            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex">
                {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.label

                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => {
                            e.preventDefault()
                            setActiveTab(item.label)
                            }}
                            className={`group flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                            isActive
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'
                            }`}
                        >
                            <Icon
                                size={16}
                                strokeWidth={2.2}
                                className={`transition-colors ${
                                    isActive ? 'text-blue-600' : 'group-hover:text-blue-600'
                                }`}
                            />

                            {item.label}
                        </a>
                    )
                })}
            </div>

            
            {/* System Status */}
            <div className='hidden items-cneter gap-3 sm:flex'>
                <div className='flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2'>
                    <span className='relative flex h-2.5 w-2.5'>
                        <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60' />
                        <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500' />
                    </span>

                    <span className='text-xs font-bold text-emerald-700'>
                        ML System Acyive
                    </span>
                </div>

                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600'>
                    <Shield size={18} strokeWidth={2.2} />
                </div>
            </div>

        </div>
    </nav>
  );

  
}

export default Navbar
