// CoinCap API utility
const BASE_URL = 'https://api.coincap.io/v2';

export async function fetchMarkets(limit = 50) {
  const url = `${BASE_URL}/assets?limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch markets');
  const data = await res.json();
  return data.data;
}

export async function fetchMarketChart(assetId, interval = 'd1') {
  // interval: m1, m5, m15, m30, h1, h2, h6, h12, d1
  const end = Date.now();
  const start = end - 7 * 24 * 60 * 60 * 1000; // 7 days ago
  const url = `${BASE_URL}/assets/${assetId}/history?interval=${interval}&start=${start}&end=${end}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch market chart');
  const data = await res.json();
  return data.data;
}

export async function searchCoins(query) {
  const url = `${BASE_URL}/assets?search=${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to search coins');
  const data = await res.json();
  return data.data;
}
