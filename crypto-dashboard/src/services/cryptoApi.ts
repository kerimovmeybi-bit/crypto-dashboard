import type { CryptoCoin } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchTopCoins = async (): Promise<CryptoCoin[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true`
    );

    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных о криптовалютах');
    }

    const data: CryptoCoin[] = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};