export interface CryptoCoin {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    sparkline_in_7d: {
        price: number[];
    };
}

export interface CoinTicker {
  market: {
    name: string;
    identifier: string;
  };
  base: string;
  target: string;
  last: number;
  converted_last: {
    usd: number;
  };
  trade_url: string;
}

export interface CoinDetailData extends CryptoCoin {
  tickers?: CoinTicker[];
}