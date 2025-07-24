import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { fetchMarketChart, fetchMarkets, searchCoins } from '../services/coingeckoAPI'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

const TIME_WINDOWS = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
]

const LiveChart = ({ coinId, window, setWindow }) => {
  const [chartData, setChartData] = useState(null)
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    async function loadChart() {
      let coinData = null
      let coinIdToUse = coinId
      // Try to resolve coinId from search
      if (coinId) {
        try {
          const searchRes = await searchCoins(coinId)
          coinIdToUse = searchRes?.coins?.length > 0 ? searchRes.coins[0].id : coinId
          const marketRes = await fetchMarkets({ per_page: 50 })
          coinData = marketRes?.find(c => c.id === coinIdToUse) || marketRes?.[0]
        } catch {
          coinIdToUse = null
        }
      }
      // Fallback to top coin if search fails or no coinId
      if (!coinIdToUse) {
        const marketRes = await fetchMarkets({ per_page: 1 })
        coinData = marketRes?.[0]
        coinIdToUse = coinData?.id
      }
      let chartRes = null
      try {
        chartRes = await fetchMarketChart(coinIdToUse, window)
      } catch {
        chartRes = null
      }
      if (active) {
        setCoin(coinData)
        setChartData(chartRes)
        setLoading(false)
      }
    }
    loadChart()
    return () => { active = false }
  }, [coinId, window])

  if (loading) return <div className="h-64 flex items-center justify-center text-white">Loading chart...</div>
  if (!chartData || !coin || !chartData.prices || chartData.prices.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No chart data available.</div>
  }

  const prices = chartData.prices.map(p => ({ time: p[0], price: p[1] }))
  const labels = prices.map(p => new Date(p.time).toLocaleTimeString())
  const isUptrend = prices.length > 1 && prices[prices.length - 1].price >= prices[0].price
  const data = {
    labels,
    datasets: [
      {
        label: `${coin.name} Price`,
        data: prices.map(p => p.price),
        borderColor: isUptrend ? '#00ff99' : '#ff3b3b',
        backgroundColor: isUptrend ? 'rgba(0,255,153,0.1)' : 'rgba(255,59,59,0.1)',
        tension: 0.4,
        pointRadius: 2,
        fill: true,
        borderWidth: 3,
        animation: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { ticks: { color: '#fff' }, grid: { color: '#232323' } },
      y: { ticks: { color: '#fff' }, grid: { color: '#232323' } },
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutQuart',
    },
  }

  return (
    <div className="bg-[#181818] rounded-2xl shadow-smooth p-4 md:p-6 w-full h-80 md:h-[28rem] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{coin.name} Live Chart</h2>
        <div className="flex gap-2">
          {TIME_WINDOWS.map(tw => (
            <button
              key={tw.label}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${window === tw.value ? 'bg-accent text-black' : 'bg-[#232323] text-white'}`}
              onClick={() => setWindow(tw.value)}
            >
              {tw.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Line data={data} options={options} style={{height: '100%'}} />
      </div>
    </div>
  )
}

export default LiveChart
