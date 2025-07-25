import { useState } from 'react'
import Header from './components/Header'
import LiveChart from './components/LiveChart'
import TopPerformers from './components/TopPerformers'
import PortfolioList from './components/PortfolioList'
// import BalanceSummary from './components/BalanceSummary'
import './index.css'

function App() {
  const [searchCoin, setSearchCoin] = useState(null)
  const [chartWindow, setChartWindow] = useState(1)

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header onSearch={setSearchCoin} />
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-2 md:px-6 py-4 gap-6">
        {/* Balance section removed as requested */}
        {/* Main chart and top performers side by side */}
        <div className="flex flex-col md:flex-row w-full gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <LiveChart coinId={searchCoin} window={chartWindow} setWindow={setChartWindow} />
            {/* Portfolio section at bottom */}
            <div className="mt-2">
              <h2 className="text-lg font-bold mb-2">Portfolio</h2>
              <PortfolioList />
            </div>
          </div>
          {/* Top performers sidebar */}
          <div className="w-full md:w-80 ml-8 flex-shrink-0">
            <TopPerformers window={chartWindow} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
