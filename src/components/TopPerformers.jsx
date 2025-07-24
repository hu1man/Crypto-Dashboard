import { useEffect, useState } from 'react'
import { fetchMarkets } from '../services/coingeckoAPI'

const TopPerformers = ({ window = '24h' }) => {
  const [coins, setCoins] = useState([])

  useEffect(() => {
    fetchMarkets({ order: 'price_change_percentage_24h_desc', per_page: 12, price_change_percentage: window })
      .then(data => setCoins(data))
  }, [window])

  return (
    <aside className="bg-[#181818] rounded-2xl shadow-smooth p-4 w-full lg:w-72 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-white mb-2">Top Performers</h2>
      {coins.map(coin => (
        <div key={coin.id} className="flex items-center justify-between bg-[#232323] rounded-lg px-3 py-2 transition-colors">
          <div className="flex items-center gap-2">
            <img src={coin.image} alt={coin.name} className="w-7 h-7" />
            <span className="text-white font-medium">{coin.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white text-sm">€{coin.current_price.toLocaleString()}</span>
            <span className={
              `text-sm font-bold ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'} transition-all`
            }>
              {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        </div>
      ))}
    </aside>
  )
}

export default TopPerformers
