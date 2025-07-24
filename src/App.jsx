import { useState } from 'react'
import Header from './components/Header'
import LiveChart from './components/LiveChart'
import TopPerformers from './components/TopPerformers'
import PortfolioList from './components/PortfolioList'
import './index.css'

function App() {
  const [searchCoin, setSearchCoin] = useState(null)
  const [chartWindow, setChartWindow] = useState(1)

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header onSearch={setSearchCoin} />
      <div className="flex flex-1 flex-col lg:flex-row gap-6 px-2 md:px-6 py-4 w-full">
        <div className="flex flex-col flex-1 gap-6">
          <LiveChart coinId={searchCoin} window={chartWindow} setWindow={setChartWindow} />
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-2">Portfolio</h2>
            <PortfolioList />
          </div>
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <TopPerformers window={chartWindow === 1 ? '24h' : chartWindow === 7 ? '7d' : '24h'} />
        </div>
      </div>
    </div>
  )
}

export default App
