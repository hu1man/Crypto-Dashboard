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
    fetchMarkets({ per_page: 20, sparkline: true })
      .then(data => {
        setCoins(data?.filter(c => PORTFOLIO_COINS.includes(c.id)) || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load portfolio data')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex gap-2 py-2 justify-center items-center w-full max-w-[260px] mx-auto">
        {Array.from({ length: PORTFOLIO_COINS.length }).map((_, idx) => (
          <div key={idx} className="bg-[#181818] rounded-2xl shadow-smooth p-2 min-w-[56px] h-28 flex flex-col items-center animate-pulse"></div>
        ))}
      </div>
    )
  }
  if (error) {
    return <div className="text-red-400 font-bold p-2">{error}</div>
  }

  return (
    <div className="flex gap-5 py-1 justify-center items-center w-full max-w-[260px] mx-auto">
      {coins.map(coin => {
        const prices = coin.sparkline_in_7d?.price || []
        const isUptrend = prices.length > 1 && prices[prices.length - 1] >= prices[0]
        return (
          <div
            key={coin.id}
            className="bg-[#181818] rounded-lg shadow-smooth p-1 min-w-[210px] h-28 flex flex-col items-center transition-transform hover:scale-105 duration-200"
          >
            <img src={coin.image} alt={coin.name} className="w-6 h-6 mb-1" />
            <span className="text-white font-semibold text-xs mb-1">{coin.name}</span>
            <span className="text-white text-xs mb-1">${coin.current_price.toLocaleString()}</span>
            <div className="w-full h-6">
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
                  height={16}
                />
              ) : <div className="h-6 text-gray-400 text-xs flex items-center justify-center">No chart data</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PortfolioList
