import { useEffect, useState } from 'react'
import { fetchMarkets } from '../services/coingeckoAPI'
import { Line } from 'react-chartjs-2'

const PORTFOLIO_COINS = ['bitcoin', 'ethereum', 'dogecoin', 'solana']

const PortfolioList = () => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchMarkets({ per_page: 20 })
      .then(data => {
        // Filter for portfolio coins
        setCoins(data.filter(c => PORTFOLIO_COINS.includes(c.id)))
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load portfolio data')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4">
        {Array.from({ length: PORTFOLIO_COINS.length }).map((_, idx) => (
          <div key={idx} className="bg-[#181818] rounded-2xl shadow-smooth p-4 min-w-[180px] flex flex-col items-center animate-pulse">
            <div className="w-10 h-10 mb-2 bg-gray-700 rounded-full" />
            <div className="h-5 w-20 bg-gray-700 rounded mb-1" />
            <div className="h-4 w-16 bg-gray-700 rounded mb-1" />
            <div className="h-4 w-12 bg-gray-700 rounded mb-2" />
            <div className="w-full h-12 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    )
  }
  if (error) {
    return <div className="text-red-400 font-bold p-4">{error}</div>
  }

  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {coins.map(coin => {
        const prices = coin.sparkline_in_7d?.price || []
        const isUptrend = prices.length > 1 && prices[prices.length - 1] >= prices[0]
        return (
          <div
            key={coin.id}
            className="bg-[#181818] rounded-2xl shadow-smooth p-4 min-w-[180px] flex flex-col items-center transition-transform hover:scale-105 duration-200"
          >
            <img src={coin.image} alt={coin.name} className="w-10 h-10 mb-2" />
            <span className="text-white font-semibold text-lg mb-1">{coin.name}</span>
            <span className="text-white text-sm mb-1">${coin.current_price.toLocaleString()}</span>
            <span className={`text-sm font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'} mb-2`}>
              {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
            <div className="w-full h-12">
              {prices.length > 0 ? (
                <Line
                  data={{
                    labels: prices.map(() => ''),
                    datasets: [{
                      data: prices,
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
              ) : <div className="h-12 text-gray-400 text-xs flex items-center justify-center">No chart data</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PortfolioList
