export interface StockExchangePrice {
  name: string;
  price: number;
}

export interface StockCompany {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  marketCap: string;
  category: string;
  history: { time: string; price: number }[];
  exchanges: StockExchangePrice[];
}