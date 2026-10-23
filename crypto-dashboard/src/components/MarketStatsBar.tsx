import React from 'react';
import type { CryptoCoin } from '../types/crypto';
import { Globe, TrendingUp, Activity, PieChart } from 'lucide-react';

interface MarketStatsBarProps {
  coins: CryptoCoin[];
}

export const MarketStatsBar: React.FC<MarketStatsBarProps> = ({ coins }) => {
  if (coins.length === 0) return null;

  const totalMarketCap = coins.reduce((acc, c) => acc + c.market_cap, 0);
  const totalVolume = coins.reduce((acc, c) => acc + c.total_volume, 0);
  
  const btc = coins.find(c => c.symbol.toLowerCase() === 'btc');
  const btcDominance = btc && totalMarketCap > 0 ? (btc.market_cap / totalMarketCap) * 100 : 42.5;

  const avgChange = coins.reduce((acc, c) => acc + c.price_change_percentage_24h, 0) / coins.length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem'
    }}>
      {/* Капитализация */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Globe size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Капитализация рынка</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
            ${(totalMarketCap / 1e12).toFixed(2)}T
          </span>
        </div>
      </div>

      {/* Объём торгов */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
          <Activity size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Объем за 24ч</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
            ${(totalVolume / 1e9).toFixed(2)}B
          </span>
        </div>
      </div>

      {/* Доминирование BTC */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
          <PieChart size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Доминирование BTC</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
            {btcDominance.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Средний тренд */}
      <div style={{
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: avgChange >= 0 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: avgChange >= 0 ? '#4ade80' : '#f87171' }}>
          <TrendingUp size={20} />
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Тренд рынка (24ч)</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: avgChange >= 0 ? '#4ade80' : '#f87171' }}>
            {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
};