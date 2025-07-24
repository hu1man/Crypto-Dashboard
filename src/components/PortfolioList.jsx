import { useEffect, useState } from 'react'
import { fetchMarkets, fetchMarketChart } from '../services/coingeckoAPI'
import { Line } from 'react-chartjs-2'

const PORTFOLIO_COINS = ['bitcoin', 'ripple', 'tether', 'solana']

const PortfolioList = () => {
  const [coins, setCoins] = useState([])
  const [charts, setCharts] = useState({})

  useEffect(() => {
    fetchMarkets({ ids: PORTFOLIO_COINS.join(',') }).then(data => setCoins(data))
  }, [])

  useEffect(() => {
    async function fetchAllCharts() {
      const chartData = {}
      for (const coin of coins) {
        try {
          const data = await fetchMarketChart(coin.id, 1)
          chartData[coin.id] = data.prices
        } catch (e) {
          chartData[coin.id] = []
        }
      }
      setCharts(chartData)
    }
    if (coins.length > 0) fetchAllCharts()
  }, [coins])

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {coins.map(coin => {
        const prices = charts[coin.id] || []
        const isUptrend = prices.length > 1 && prices[prices.length - 1][1] >= prices[0][1]
        return (
          <div
            key={coin.id}
            className="bg-[#181818] rounded-2xl shadow-smooth p-4 min-w-[180px] flex flex-col items-center transition-transform hover:scale-105 duration-200"
          >
            <img src={coin.image} alt={coin.name} className="w-10 h-10 mb-2" />
            <span className="text-white font-semibold text-lg mb-1">{coin.name}</span>
            <span className="text-white text-sm mb-1">€{coin.current_price.toLocaleString()}</span>
            <span className={
              `text-sm font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'} mb-2`
            }>
              {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
            <div className="w-full h-12">
              {prices.length > 0 ? (
                <Line
                  data={{
                    labels: prices.map(p => ''),
                    datasets: [{
                      data: prices.map(p => p[1]),
                      borderColor: isUptrend ? '#00ff99' : '#ff3b3b',
                      backgroundColor: isUptrend ? 'rgba(0,255,153,0.05)' : 'rgba(255,59,59,0.05)',
                      tension: 0.4,
                      pointRadius: 0,
                    }],
                  }}
                  options={{
                    plugins: { legend: { display: false } },
                    scales: { x: { display: false }, y: { display: false } },
                    elements: { line: { borderWidth: 2 } },
                    animation: { duration: 1000 },
                    maintainAspectRatio: false,
                  }}
                  height={48}
                />
              ) : <div className="h-12" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PortfolioList
