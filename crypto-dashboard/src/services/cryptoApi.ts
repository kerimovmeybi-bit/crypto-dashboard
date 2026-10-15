import type { CryptoCoin, CoinTicker } from '../types/crypto';

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

export const fetchCoinTickers = async (coinId: string): Promise<CoinTicker[]> => {
  try {
    const response = await fetch(`${BASE_URL}/coins/${coinId}/tickers`);
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить биржевые данные');
    }

    const data = await response.json();
    // Возвращаем первые 5 бирж для наглядности
    return data.tickers.slice(0, 5);
  } catch (error) {
    console.error('Tickers API Error:', error);
    return [];
  }
};