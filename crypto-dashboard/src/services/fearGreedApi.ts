export interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
}

export const fetchFearAndGreed = async (): Promise<FearGreedData | null> => {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      return data.data[0];
    }
    return null;
  } catch (error) {
    console.error('Ошибка загрузки Fear & Greed Index:', error);
    return null;
  }
};