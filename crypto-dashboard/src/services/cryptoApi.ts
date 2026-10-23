import type { CryptoCoin, CoinTicker } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-nanX5AvcAACAAdF6YQ65LtNf';

export const fetchTopCoins = async (): Promise<CryptoCoin[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true`,
      {
        headers: {
          'x-cg-demo-api-key': API_KEY,
        },
      }
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
    const response = await fetch(`${BASE_URL}/coins/${coinId}/tickers`, {
      headers: {
        'x-cg-demo-api-key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Не удалось загрузить биржевые данные');
    }

    const data = await response.json();
    const rawTickers = data.tickers || [];

    // Фильтруем тикеры, где есть цена в USD или USDT
    const validTickers = rawTickers.filter(
      (t: any) => t.last && (t.target === 'USDT' || t.target === 'USD')
    );

    // Если нашли пары с USD/USDT — берем их, иначе исходный массив
    const tickersToUse = validTickers.length > 0 ? validTickers : rawTickers;

    // Возвращаем первые 5 бирж
    return tickersToUse.slice(0, 5);
  } catch (error) {
    console.error('Tickers API Error:', error);
    return [];
  }
};

export interface MarketChartData {
  prices: [number, number][]; // [timestamp, price]
}

export const fetchCoinMarketChart = async (coinId: string): Promise<[number, number][]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=7`,
      {
        headers: {
          'x-cg-demo-api-key': API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Не удалось загрузить данные графика');
    }

    const data: MarketChartData = await response.json();
    return data.prices || [];
  } catch (error) {
    console.error('Market Chart API Error:', error);
    return [];
  }
};