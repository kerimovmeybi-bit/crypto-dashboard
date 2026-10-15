import React from 'react';
import type { CryptoCoin } from '../types/crypto';
import { X, ArrowUpRight, ArrowDownRight,} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinModalProps {
  coin: CryptoCoin | null;
  onClose: () => void;
}

export const CoinModal: React.FC<CoinModalProps> = ({ coin, onClose }) => {
  if (!coin) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'var(--bg-modal)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '1rem'
        }}
      >
        <motion.div 
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            backgroundColor: '#161a25',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}
        >
          {/* Кнопка закрытия */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              padding: '0.5rem',
              color: '#9ca3af',
              cursor: 'pointer',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>

          {/* Заголовок */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src={coin.image} alt={coin.name} style={{ width: '52px', height: '52px' }} />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>{coin.name}</h2>
              <span style={{ color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>{coin.symbol}</span>
            </div>
          </div>

          {/* Детализация цен */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowUpRight size={14} color="#10b981" /> 24h High
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '0.25rem' }}>
                ${coin.high_24h.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowDownRight size={14} color="#ef4444" /> 24h Low
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', marginTop: '0.25rem' }}>
                ${coin.low_24h.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Доп статистика */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>Общий объем (24h):</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>${coin.total_volume.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>Рыночная капитализация:</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>${coin.market_cap.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};