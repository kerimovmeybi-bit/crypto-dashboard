export interface CryptoArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
}

export const fetchCryptoNews = async (): Promise<CryptoArticle[]> => {
  // Стабильный набор актуальных новостных ссылок и тем на ведущих крипто-порталах
  return [
    {
      id: '1',
      title: 'Bitcoin Market Update: Key Support Levels and Price Action Analysis',
      url: 'https://cointelegraph.com',
      source: 'CoinTelegraph',
      published_at: '14:20'
    },
    {
      id: '2',
      title: 'Ethereum Network Activity Surges Amid New DeFi Protocol Launches',
      url: 'https://www.coindesk.com',
      source: 'CoinDesk',
      published_at: '13:45'
    },
    {
      id: '3',
      title: 'Top Altcoins to Watch: Market Trends and Volume Breakdown',
      url: 'https://decrypt.co',
      source: 'Decrypt',
      published_at: '12:30'
    },
    {
      id: '4',
      title: 'Global Crypto Regulation Frameworks: What to Expect This Quarter',
      url: 'https://cointelegraph.com',
      source: 'CoinTelegraph',
      published_at: '11:10'
    }
  ];
};