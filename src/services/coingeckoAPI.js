// CoinGecko API utility
const BASE_URL = 'https://api.coingecko.com/api/v3';

export async function fetchMarkets(params = {}) {
  const url = new URL(`${BASE_URL}/coins/markets`);
  url.search = new URLSearchParams({
    vs_currency: params.vs_currency || 'eur',
    order: params.order || 'market_cap_desc',
    per_page: params.per_page || 50,
    page: params.page || 1,
    price_change_percentage: params.price_change_percentage || '24h,7d',
    ...params,
  }).toString();
  const res = await fetch(url);
  return res.json();
}

export async function fetchMarketChart(coinId, days = 1, vs_currency = 'eur') {
  const url = `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${vs_currency}&days=${days}`;
  const res = await fetch(url);
  return res.json();
}

export async function searchCoins(query) {
  const url = `${BASE_URL}/search?query=${query}`;
  const res = await fetch(url);
  return res.json();
}
