import React, { useState } from 'react';
import type { CryptoCoin } from '../types/crypto';
import { Scale, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCompareProps {
  coins: CryptoCoin[];
}

export const CryptoCompareWidget: React.FC<CryptoCompareProps> = ({ coins }) => {
  const [coin1Id, setCoin1Id] = useState<string>(coins[0]?.id || '');
  const [coin2Id, setCoin2Id] = useState<string>(coins[1]?.id || '');

  const coin1 = coins.find(c => c.id === coin1Id) || coins[0];
  const coin2 = coins.find(c => c.id === coin2Id) || coins[1];

  if (!coin1 || !coin2) return null;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card, #0f172a)',
      border: '1px solid var(--border-color, #1e293b)',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(168, 85, 247, 0.15)',
          color: '#c084fc'
        }}>
          <Scale size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Сравнение активов (Crypto VS Crypto)</h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Сравните показатели двух любых монет</span>
        </div>
      </div>

      {/* Селекторы монет */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <select
          value={coin1Id}
          onChange={(e) => setCoin1Id(e.target.value)}
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#fff',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {coins.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
          ))}
        </select>

        <div style={{ color: '#c084fc', display: 'flex', justifyContent: 'center' }}>
          <ArrowRightLeft size={20} />
        </div>

        <select
          value={coin2Id}
          onChange={(e) => setCoin2Id(e.target.value)}
          style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#fff',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {coins.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
          ))}
        </select>
      </div>

      {/* Таблица сравнения */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[coin1, coin2].map((coin, idx) => {
          const isPositive = coin.price_change_percentage_24h >= 0;
          return (
            <div key={idx} style={{
              backgroundColor: 'rgba(30, 41, 59, 0.4)',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={coin.image} alt={coin.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{coin.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{coin.symbol}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Цена</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>${coin.current_price.toLocaleString()}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Изменение 24h</div>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  color: isPositive ? '#4ade80' : '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}>
                  {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Рыночная капитализация</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#e2e8f0' }}>
                  ${(coin.market_cap / 1e9).toFixed(2)} млрд
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};