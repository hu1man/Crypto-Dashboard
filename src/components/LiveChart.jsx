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
  { label: '1H', value: 0.0417 },
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '30D', value: 30 },
]

const LiveChart = ({ coinId, window, setWindow }) => {
  const [chartData, setChartData] = useState(null)
  const [coin, setCoin] = useState(null)

  useEffect(() => {
    let active = true
    async function loadChart() {
      let coinData
      let coinIdToUse = coinId
      if (coinId) {
        // Try to find the coin by symbol or name
        const searchRes = await searchCoins(coinId)
        if (searchRes.coins && searchRes.coins.length > 0) {
          coinIdToUse = searchRes.coins[0].id
        } else {
          // fallback: try direct id
          coinIdToUse = coinId.toLowerCase()
        }
        const marketRes = await fetchMarkets({ ids: coinIdToUse })
        coinData = marketRes[0]
      } else {
        const marketRes = await fetchMarkets({ per_page: 1 })
        coinData = marketRes[0]
        coinIdToUse = coinData.id
      }
      if (!coinData) return
      const chartRes = await fetchMarketChart(coinIdToUse, window)
      if (active) {
        setCoin(coinData)
        setChartData(chartRes)
      }
    }
    loadChart()
    return () => { active = false }
  }, [coinId, window])

  if (!chartData || !coin) return <div className="h-64 flex items-center justify-center text-white">Loading chart...</div>

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
        pointRadius: 0,
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
    animation: { duration: 1000 },
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
