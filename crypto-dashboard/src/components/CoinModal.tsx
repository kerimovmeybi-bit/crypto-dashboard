import React, { useEffect, useState } from 'react';
import type { CryptoCoin, CoinTicker } from '../types/crypto';
import { fetchCoinTickers } from '../services/cryptoApi';
import { X, ArrowUpRight, ArrowDownRight, ExternalLink, Building2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinModalProps {
  coin: CryptoCoin | null;
  onClose: () => void;
}

export const CoinModal: React.FC<CoinModalProps> = ({ coin, onClose }) => {
  const [tickers, setTickers] = useState<CoinTicker[]>([]);
  const [loadingTickers, setLoadingTickers] = useState<boolean>(false);

  useEffect(() => {
    if (!coin) return;

    const loadTickers = async () => {
      setLoadingTickers(true);
      const data = await fetchCoinTickers(coin.id);
      setTickers(data);
      setLoadingTickers(false);
    };

    loadTickers();
  }, [coin]);

  if (!coin) return null;

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
            backgroundColor: 'var(--modal-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '2rem',
            width: '100%',
            maxWidth: '550px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}
        >
          {/* Кнопка закрытия */}
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '50%',
              padding: '0.5rem',
              color: 'var(--text-secondary)',
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
              <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{coin.name}</h2>
              <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600' }}>{coin.symbol}</span>
            </div>
          </div>

          {/* Детализация цен */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowUpRight size={14} color="#10b981" /> 24h High
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                ${coin.high_24h.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <ArrowDownRight size={14} color="#ef4444" /> 24h Low
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                ${coin.low_24h.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Секция: Цены на разных биржах */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.05rem' }}>
              <Building2 size={18} color="#6366f1" />
              Цены на других биржах
            </div>

            {loadingTickers ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-secondary)' }}>
                <Loader2 className="animate-spin" size={24} color="#6366f1" />
              </div>
            ) : tickers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {tickers.map((ticker, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {ticker.market.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                        {ticker.base} / {ticker.target}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>
                        ${ticker.converted_last?.usd ? ticker.converted_last.usd.toLocaleString() : 'N/A'}
                      </span>

                      {ticker.trade_url && (
                        <a 
                          href={ticker.trade_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: '#6366f1',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'transform 0.2s'
                          }}
                          title="Перейти на биржу"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Нет данных о биржах для этой монеты
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};