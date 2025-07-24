import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { searchCoins } from '../services/coingeckoAPI'

const Header = ({ onSearch }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background shadow-smooth rounded-b-2xl">
      <div className="flex items-center gap-3">
        <img src="/icon.png" alt="Crypto Hub Icon" className="w-8 h-8 rounded-full" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Crypto Hub</h1>
      </div>
      <form
        className="flex items-center bg-[#232323] rounded-lg px-3 py-2 w-72"
        onSubmit={async e => {
          e.preventDefault()
          const value = e.target.search.value.trim().toLowerCase()
          if (value) {
            const results = await searchCoins(value)
            if (results && results.coins && results.coins.length > 0) {
              onSearch(results.coins[0].id)
            } else {
              onSearch(value)
            }
          }
        }}
      >
        <MagnifyingGlassIcon className="w-5 h-5 text-accent mr-2" />
        <input
          name="search"
          type="text"
          placeholder="Search coin..."
          className="bg-transparent outline-none text-white flex-1"
        />
      </form>
    </header>
  )
}

export default Header
