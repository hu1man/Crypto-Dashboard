import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid'

const BalanceSummary = () => {
  // Mocked data
  const balance = 800203
  const gain = 8.9
  const loss = 2.1

  return (
    <div className="bg-[#181818] rounded-2xl shadow-smooth p-6 text-white w-full max-w-xs mx-auto mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold">Portfolio Balance</span>
        <span className="text-2xl font-bold text-accent">€{balance.toLocaleString()}</span>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex items-center gap-1">
          <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">+{gain}%</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-medium">-{loss}%</span>
        </div>
      </div>
    </div>
  )
}

export default BalanceSummary
