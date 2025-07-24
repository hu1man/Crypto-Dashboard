// CoinGecko API utility
const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-HRnTH23NrCzAa5YFJqSFpyEX';

// Helper to add API key as query parameter
function withApiKey(url) {
  if (url.includes('?')) {
    return `${url}&x_cg_demo_api_key=${API_KEY}`;
  } else {
    return `${url}?x_cg_demo_api_key=${API_KEY}`;
  }
}

async function fetchWithKey(url) {
  const res = await fetch(withApiKey(url));
  if (!res.ok) throw new Error('Failed to fetch');
  return await res.json();
}

// Get top coins by market cap
export async function fetchMarkets({ vs_currency = 'usd', per_page = 20, page = 1, ids } = {}) {
  let url = `${BASE_URL}/coins/markets?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
  if (ids) url += `&ids=${ids}`;
  return await fetchWithKey(url);
}

// Get historical price data for a coin
export async function fetchMarketChart(coinId, days = 1, vs_currency = 'usd') {
  const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=${days}`;
  return await fetchWithKey(url);
}

// Search coins by name or symbol
export async function searchCoins(query) {
  const url = `${BASE_URL}/search?query=${query}`;
  return await fetchWithKey(url);
}
