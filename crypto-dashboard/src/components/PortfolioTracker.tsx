import React, { useState, useEffect } from 'react';
import type { CryptoCoin } from '../types/crypto';
import { Wallet, Plus, Trash2, PieChart } from 'lucide-react';

interface PortfolioItem {
  coinId: string;
  amount: number;
}

interface PortfolioTrackerProps {
  coins: CryptoCoin[];
}

export const PortfolioTracker: React.FC<PortfolioTrackerProps> = ({ coins }) => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('crypto_portfolio');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCoinId, setSelectedCoinId] = useState<string>(coins[0]?.id || '');
  const [amountInput, setAmountInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('crypto_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  // Если монеты загрузились, а выбор пустой — ставим первую
  useEffect(() => {
    if (coins.length > 0 && !selectedCoinId) {
      setSelectedCoinId(coins[0].id);
    }
  }, [coins, selectedCoinId]);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountInput);
    if (!selectedCoinId || isNaN(numAmount) || numAmount <= 0) return;

    setPortfolio(prev => {
      const existingIndex = prev.findIndex(item => item.coinId === selectedCoinId);
      if (existingIndex > -1) {
        // Если монета уже есть, прибавляем количество
        const updated = [...prev];
        updated[existingIndex].amount += numAmount;
        return updated;
      } else {
        // Иначе добавляем новую
        return [...prev, { coinId: selectedCoinId, amount: numAmount }];
      }
    });

    setAmountInput('');
  };

  const handleRemoveAsset = (coinId: string) => {
    setPortfolio(prev => prev.filter(item => item.coinId !== coinId));
  };

  // Считаем общую стоимость портфеля
  const totalPortfolioValue = portfolio.reduce((sum, item) => {
    const coin = coins.find(c => c.id === item.coinId);
    return sum + (coin ? coin.current_price * item.amount : 0);
  }, 0);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card, #0f172a)',
      border: '1px solid var(--border-color, #1e293b)',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      color: '#fff'
    }}>
      {/* Шапка портфеля */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8'
          }}>
            <Wallet size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Мой портфель</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Учет и баланс ваших активов</span>
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
          border: '1px solid #334155',
          padding: '0.6rem 1.25rem',
          borderRadius: '14px',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Общая стоимость</span>
          <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#34d399' }}>
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Форма добавления актива */}
      <form onSubmit={handleAddAsset} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select
          value={selectedCoinId}
          onChange={(e) => setSelectedCoinId(e.target.value)}
          style={{
            flex: '2',
            minWidth: '160px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '0.7rem 1rem',
            color: '#fff',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {coins.map(coin => (
            <option key={coin.id} value={coin.id} style={{ background: '#0f172a' }}>
              {coin.name} ({coin.symbol.toUpperCase()}) — ${coin.current_price.toLocaleString()}
            </option>
          ))}
        </select>

        <input
          type="number"
          step="any"
          placeholder="Количество (например, 0.5)"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          style={{
            flex: '2',
            minWidth: '160px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '0.7rem 1rem',
            color: '#fff',
            fontWeight: '600',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          style={{
            flex: '1',
            minWidth: '120px',
            backgroundColor: '#6366f1',
            border: 'none',
            borderRadius: '12px',
            padding: '0.7rem 1rem',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <Plus size={18} /> Добавить
        </button>
      </form>

      {/* Список добавленных монет в портфеле */}
      {portfolio.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#64748b', fontSize: '0.85rem' }}>
          Портфель пуст. Добавьте свою первую монету выше!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {portfolio.map(item => {
            const coin = coins.find(c => c.id === item.coinId);
            if (!coin) return null;
            const assetTotalValue = coin.current_price * item.amount;
            const sharePercent = totalPortfolioValue > 0 ? (assetTotalValue / totalPortfolioValue) * 100 : 0;

            return (
              <div key={item.coinId} style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid #1e293b',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={coin.image} alt={coin.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>{coin.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.amount} {coin.symbol.toUpperCase()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveAsset(item.coinId)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '0.2rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Удалить актив"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff' }}>
                    ${assetTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <PieChart size={12} /> {sharePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};