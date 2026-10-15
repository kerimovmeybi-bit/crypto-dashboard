import React from 'react';
import type { CryptoCoin } from '../types/crypto';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { SparklineChart } from './SparklineChart';

interface CoinCardProps {
  coin: CryptoCoin;
  isFavorite: boolean;
  onToggleFavorite: (coinId: string, e: React.MouseEvent) => void;
  onClick: () => void;
}

export const CoinCard: React.FC<CoinCardProps> = ({ 
  coin, 
  isFavorite, 
  onToggleFavorite, 
  onClick 
}) => {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <motion.div 
      className="crypto-card"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        borderRadius: '20px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div>
        {/* Шапка карточки */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img src={coin.image} alt={coin.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>{coin.name}</h3>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', textTransform: 'uppercase' }}>{coin.symbol}</span>
            </div>
          </div>

          <button
            onClick={(e) => onToggleFavorite(coin.id, e)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Star 
              size={22} 
              color={isFavorite ? '#f59e0b' : '#4b5563'} 
              fill={isFavorite ? '#f59e0b' : 'transparent'} 
            />
          </button>
        </div>

        {/* Цена, Проценты и Мини-график */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
              ${coin.current_price.toLocaleString()}
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: '600',
              backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              color: isPositive ? '#34d399' : '#f87171',
              border: `1px solid ${isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
            }}>
              {isPositive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>

          {/* График Sparkline */}
          {coin.sparkline_in_7d && (
            <div style={{ opacity: 0.85, paddingBottom: '0.2rem' }}>
              <SparklineChart data={coin.sparkline_in_7d.price} isPositive={isPositive} />
            </div>
          )}
        </div>
      </div>

      {/* Футер карточки */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem'
      }}>
        <span>Market Cap</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>${(coin.market_cap / 1e9).toFixed(2)}B</span>
      </div>
    </motion.div>
  );
};