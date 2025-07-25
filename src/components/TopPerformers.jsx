import { useEffect, useState } from 'react'
import { fetchMarkets } from '../services/coingeckoAPI'

const TopPerformers = ({ window = '24h' }) => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchMarkets({ per_page: 8, price_change_percentage: window })
      .then(data => {
        setCoins(data || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load top performers')
        setLoading(false)
      })
  }, [window])

  if (loading) {
    return (
      <aside className="bg-[#181818] rounded-2xl shadow-smooth p-2 w-full flex flex-col gap-2 min-h-[240px] max-h-[520px] max-w-[220px]">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between bg-[#232323] rounded-lg px-2 py-1 animate-pulse h-8"></div>
        ))}
      </aside>
    )
  }
  if (error) {
    return <div className="text-red-400 font-bold p-2">{error}</div>
  }

  return (
    <aside className="bg-[#181818] rounded-2xl shadow-smooth p-2 w-full flex flex-col gap-2 min-h-[240px] max-h-[520px] max-w-[220px] overflow-hidden">
      <h2 className="text-base font-bold text-white mb-1">Top Performers</h2>
      {coins.map(coin => (
        <div key={coin.id} className="flex items-center justify-between bg-[#232323] rounded-lg px-2 py-1 h-10">
          <div className="flex items-center gap-1">
            <img src={coin.image} alt={coin.name} className="w-5 h-5" />
            <span className="text-white text-xs font-medium">{coin.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white text-xs">${coin.current_price.toLocaleString()}</span>
            <span className={`text-xs font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>{coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%</span>
          </div>
        </div>
      ))}
    </aside>
  )
}

export default TopPerformers
