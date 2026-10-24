import React, { useState } from 'react';
import type { StockCompany } from '../types/stock';
import { StockModal } from './StockModal';
import { Building2, TrendingUp, TrendingDown } from 'lucide-react';

const MOCK_STOCKS: StockCompany[] = [
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    logo: '',
    price: 138.25,
    change24h: 3.45,
    high24h: 140.10,
    low24h: 134.50,
    marketCap: '$3.40T',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 132 },
      { time: '19.10', price: 134 },
      { time: '20.10', price: 131 },
      { time: '21.10', price: 135 },
      { time: '22.10', price: 136 },
      { time: '23.10', price: 137 },
      { time: '24.10', price: 138.25 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 138.25 },
      { name: 'NYSE Arca', price: 138.10 },
      { name: 'LSE (London)', price: 138.60 },
      { name: 'XETRA (Frankfurt)', price: 137.95 },
      { name: 'Cboe BATS', price: 138.30 },
    ]
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    logo: '',
    price: 232.10,
    change24h: 1.12,
    high24h: 234.00,
    low24h: 229.80,
    marketCap: '$3.52T',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 228 },
      { time: '19.10', price: 229 },
      { time: '20.10', price: 230 },
      { time: '21.10', price: 231 },
      { time: '22.10', price: 230.5 },
      { time: '23.10', price: 231.8 },
      { time: '24.10', price: 232.10 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 232.10 },
      { name: 'NYSE Arca', price: 231.90 },
      { name: 'Cboe BATS', price: 232.40 },
      { name: 'LSE (London)', price: 232.00 },
    ]
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    logo: '',
    price: 428.50,
    change24h: -0.85,
    high24h: 432.10,
    low24h: 425.30,
    marketCap: '$3.18T',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 435 },
      { time: '19.10', price: 432 },
      { time: '20.10', price: 430 },
      { time: '21.10', price: 429 },
      { time: '22.10', price: 431 },
      { time: '23.10', price: 427 },
      { time: '24.10', price: 428.50 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 428.50 },
      { name: 'NYSE Arca', price: 427.90 },
      { name: 'XETRA (Frankfurt)', price: 429.20 },
    ]
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    logo: '',
    price: 186.75,
    change24h: 1.80,
    high24h: 188.20,
    low24h: 183.50,
    marketCap: '$1.94T',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 180 },
      { time: '19.10', price: 182 },
      { time: '20.10', price: 181 },
      { time: '21.10', price: 183 },
      { time: '22.10', price: 185 },
      { time: '23.10', price: 184.5 },
      { time: '24.10', price: 186.75 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 186.75 },
      { name: 'LSE (London)', price: 186.10 },
      { name: 'Cboe BATS', price: 187.20 },
    ]
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    logo: '',
    price: 165.40,
    change24h: 0.95,
    high24h: 167.10,
    low24h: 163.80,
    marketCap: '$2.05T',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 161 },
      { time: '19.10', price: 163 },
      { time: '20.10', price: 162 },
      { time: '21.10', price: 164 },
      { time: '22.10', price: 163.5 },
      { time: '23.10', price: 164.8 },
      { time: '24.10', price: 165.40 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 165.40 },
      { name: 'NYSE Arca', price: 165.10 },
      { name: 'XETRA (Frankfurt)', price: 165.85 },
    ]
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms',
    logo: '',
    price: 578.90,
    change24h: 2.15,
    high24h: 584.00,
    low24h: 569.50,
    marketCap: '$1.46T',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 555 },
      { time: '19.10', price: 560 },
      { time: '20.10', price: 568 },
      { time: '21.10', price: 564 },
      { time: '22.10', price: 572 },
      { time: '23.10', price: 575 },
      { time: '24.10', price: 578.90 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 578.90 },
      { name: 'Cboe BATS', price: 577.80 },
      { name: 'LSE (London)', price: 580.20 },
    ]
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    logo: '',
    price: 218.40,
    change24h: -2.30,
    high24h: 224.50,
    low24h: 216.00,
    marketCap: '$695B',
    category: 'Big Tech',
    history: [
      { time: '18.10', price: 225 },
      { time: '19.10', price: 222 },
      { time: '20.10', price: 220 },
      { time: '21.10', price: 219 },
      { time: '22.10', price: 221 },
      { time: '23.10', price: 217 },
      { time: '24.10', price: 218.40 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 218.40 },
      { name: 'XETRA (Frankfurt)', price: 217.80 },
      { name: 'NYSE Arca', price: 218.90 },
    ]
  },
  {
    id: 'amd',
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    logo: '',
    price: 156.30,
    change24h: 4.10,
    high24h: 158.90,
    low24h: 149.50,
    marketCap: '$252B',
    category: 'Semiconductors',
    history: [
      { time: '18.10', price: 145 },
      { time: '19.10', price: 148 },
      { time: '20.10', price: 147 },
      { time: '21.10', price: 151 },
      { time: '22.10', price: 153 },
      { time: '23.10', price: 152.5 },
      { time: '24.10', price: 156.30 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 156.30 },
      { name: 'NYSE Arca', price: 155.80 },
      { name: 'Cboe BATS', price: 156.90 },
    ]
  },
  {
    id: 'mstr',
    symbol: 'MSTR',
    name: 'MicroStrategy Inc.',
    logo: '',
    price: 195.30,
    change24h: 8.25,
    high24h: 198.50,
    low24h: 182.00,
    marketCap: '$39.1B',
    category: 'Crypto Stocks',
    history: [
      { time: '18.10', price: 175 },
      { time: '19.10', price: 180 },
      { time: '20.10', price: 182 },
      { time: '21.10', price: 186 },
      { time: '22.10', price: 190 },
      { time: '23.10', price: 192 },
      { time: '24.10', price: 195.30 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 195.30 },
      { name: 'Cboe BATS', price: 194.70 },
      { name: 'NYSE Arca', price: 195.95 },
    ]
  },
  {
    id: 'coin',
    symbol: 'COIN',
    name: 'Coinbase Global',
    logo: '',
    price: 215.90,
    change24h: 5.60,
    high24h: 218.00,
    low24h: 204.00,
    marketCap: '$52.8B',
    category: 'Crypto Stocks',
    history: [
      { time: '18.10', price: 198 },
      { time: '19.10', price: 202 },
      { time: '20.10', price: 205 },
      { time: '21.10', price: 208 },
      { time: '22.10', price: 212 },
      { time: '23.10', price: 214 },
      { time: '24.10', price: 215.90 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 215.90 },
      { name: 'LSE (London)', price: 214.90 },
      { name: 'NYSE Arca', price: 216.50 },
    ]
  },
  {
    id: 'pltr',
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    logo: '',
    price: 43.80,
    change24h: 6.40,
    high24h: 44.50,
    low24h: 40.80,
    marketCap: '$98.2B',
    category: 'AI & Data',
    history: [
      { time: '18.10', price: 38 },
      { time: '19.10', price: 39 },
      { time: '20.10', price: 40 },
      { time: '21.10', price: 41.5 },
      { time: '22.10', price: 41.0 },
      { time: '23.10', price: 42.8 },
      { time: '24.10', price: 43.80 },
    ],
    exchanges: [
      { name: 'NYSE', price: 43.80 },
      { name: 'NYSE Arca', price: 43.50 },
      { name: 'Cboe BATS', price: 44.10 },
    ]
  },
  {
    id: 'nflx',
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    logo: '',
    price: 755.20,
    change24h: -1.05,
    high24h: 768.00,
    low24h: 749.00,
    marketCap: '$324B',
    category: 'Entertainment',
    history: [
      { time: '18.10', price: 740 },
      { time: '19.10', price: 748 },
      { time: '20.10', price: 760 },
      { time: '21.10', price: 765 },
      { time: '22.10', price: 758 },
      { time: '23.10', price: 762 },
      { time: '24.10', price: 755.20 },
    ],
    exchanges: [
      { name: 'NASDAQ', price: 755.20 },
      { name: 'XETRA (Frankfurt)', price: 753.80 },
      { name: 'LSE (London)', price: 757.50 },
    ]
  }
];

export const StockMarketWidget: React.FC = () => {
  const [selectedStock, setSelectedStock] = useState<StockCompany | null>(null);

  return (
    <div style={{
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backdropFilter: 'blur(10px)',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Building2 size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Акции компаний и биржи (Stock Analytics)</h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Нажмите на акцию компании для детального анализа и арбитража</span>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {MOCK_STOCKS.map((stock) => {
          const isPos = stock.change24h >= 0;
          return (
            <div
              key={stock.id}
              onClick={() => setSelectedStock(stock)}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '1.2rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>{stock.symbol}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{stock.name}</span>
                </div>
                <div style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  backgroundColor: isPos ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isPos ? '#4ade80' : '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {isPos ? '+' : ''}{stock.change24h.toFixed(2)}%
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.6rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Цена</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>${stock.price.toFixed(2)}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Market Cap</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#cbd5e1' }}>{stock.marketCap}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <StockModal stock={selectedStock} onClose={() => setSelectedStock(null)} />
    </div>
  );
};