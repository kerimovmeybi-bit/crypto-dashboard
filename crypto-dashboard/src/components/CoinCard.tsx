import React from 'react';
import type { CryptoCoin } from '../types/crypto';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoinCardProps {
  coin: CryptoCoin;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

export const CoinCard: React.FC<CoinCardProps> = ({
  coin,
  isFavorite,
  onToggleFavorite,
  onClick,
}) => {
  const isPositive = coin.price_change_percentage_24h >= 0;
  const glowColor = isPositive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        position: 'relative',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '1.25rem',
        cursor: 'pointer',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 15px 30px -5px ${glowColor}, 0 0 15px ${glowColor}`;
        e.currentTarget.style.borderColor = isPositive ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      {/* Шапка карточки */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src={coin.image} alt={coin.name} style={{ width: '38px', height: '38px', borderRadius: '50%' }} />
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{coin.name}</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>
              {coin.symbol}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => onToggleFavorite(coin.id, e)}
          style={{
            background: 'transparent',
            border: 'none',
            color: isFavorite ? '#eab308' : '#475569',
            cursor: 'pointer',
            padding: '0.25rem',
            transition: 'color 0.2s'
          }}
        >
          <Star size={20} fill={isFavorite ? '#eab308' : 'none'} />
        </button>
      </div>

      {/* Цена и изменение */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff' }}>
          ${coin.current_price.toLocaleString()}
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
          padding: '0.25rem 0.6rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: '700',
          backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: isPositive ? '#4ade80' : '#f87171'
        }}>
          {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {/* Капитализация */}
      <div style={{
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        color: '#94a3b8',
        fontSize: '0.8rem'
      }}>
        <span>Market Cap</span>
        <span style={{ color: '#fff', fontWeight: '600' }}>
          ${(coin.market_cap / 1e9).toFixed(2)}B
        </span>
      </div>
    </motion.div>
  );
};