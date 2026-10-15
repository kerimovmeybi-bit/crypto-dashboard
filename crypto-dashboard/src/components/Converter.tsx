import React, { useState } from 'react';
import type { CryptoCoin } from '../types/crypto';
import { ArrowLeftRight } from 'lucide-react';

interface ConverterProps {
  coins: CryptoCoin[];
}

export const Converter: React.FC<ConverterProps> = ({ coins }) => {
  const [amount, setAmount] = useState<number>(1);
  const [selectedCoinId, setSelectedCoinId] = useState<string>(coins[0]?.id || 'bitcoin');

  const selectedCoin = coins.find(c => c.id === selectedCoinId) || coins[0];
  const convertedUsd = selectedCoin ? (amount * selectedCoin.current_price).toLocaleString() : '0';

  if (!coins.length) return null;

  return (
    <div style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: '20px',
      padding: '1.5rem 2rem',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.6rem', borderRadius: '12px', display: 'flex' }}>
          <ArrowLeftRight size={22} color="#6366f1" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Калькулятор конвертации</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Быстрый пересчет в USD</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', width: '100%', maxWidth: '600px' }}>
        {/* Количество */}
        <input 
          type="number" 
          value={amount} 
          min="0"
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{
            flex: '1',
            minWidth: '100px',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(15, 17, 23, 0.6)',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none'
          }}
        />

        {/* Выбор монеты */}
        <select
          value={selectedCoinId}
          onChange={(e) => setSelectedCoinId(e.target.value)}
          style={{
            flex: '1.5',
            minWidth: '150px',
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#161a25',
            color: '#fff',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {coins.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol.toUpperCase()})
            </option>
          ))}
        </select>

        <span style={{ color: '#9ca3af', fontSize: '1.2rem', fontWeight: 'bold' }}>=</span>

        {/* Результат в USD */}
        <div style={{
          flex: '1.5',
          padding: '0.65rem 1rem',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#34d399',
          fontSize: '1.1rem',
          fontWeight: '700',
          textAlign: 'center'
        }}>
          ${convertedUsd}
        </div>
      </div>
    </div>
  );
};