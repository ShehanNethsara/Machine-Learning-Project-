import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DashboardStats from './components/DashboardStats'
import PredictionSection from './components/PredictionSection'
import PerformanceSection from './components/PerformanceSection'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar activeTab={activeTab} onNavigate={setActiveTab} />

      <main key={activeTab} className="animate-page-in">
        {activeTab === 'dashboard' && (
          <>
            <Hero onGetStarted={() => setActiveTab('prediction')} />
            <DashboardStats />
          </>
        )}

        {activeTab === 'prediction' && <PredictionSection />}

        {activeTab === 'performance' && <PerformanceSection />}
      </main>

      <Footer />
    </div>
  )
}

export default App
