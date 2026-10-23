import React, { useState, useEffect } from 'react';
import type { CryptoCoin } from '../types/crypto';
import { Wallet, Plus, Trash2, Download, Upload } from 'lucide-react';

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

  const [selectedCoinId, setSelectedCoinId] = useState<string>(coins[0]?.id || 'bitcoin');
  const [amountInput, setAmountInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('crypto_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountInput);
    if (!numAmount || numAmount <= 0) return;

    setPortfolio(prev => {
      const existing = prev.find(item => item.coinId === selectedCoinId);
      if (existing) {
        return prev.map(item =>
          item.coinId === selectedCoinId
            ? { ...item, amount: item.amount + numAmount }
            : item
        );
      }
      return [...prev, { coinId: selectedCoinId, amount: numAmount }];
    });

    setAmountInput('');
  };

  const handleRemoveAsset = (coinId: string) => {
    setPortfolio(prev => prev.filter(item => item.coinId !== coinId));
  };

  // Экспорт данных в JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(portfolio, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "crypto_portfolio_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Импорт данных из JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setPortfolio(parsed);
          }
        } catch (err) {
          alert('Ошибка при чтении файла JSON');
        }
      };
    }
  };

  const totalValue = portfolio.reduce((acc, item) => {
    const coin = coins.find(c => c.id === item.coinId);
    return acc + (coin ? coin.current_price * item.amount : 0);
  }, 0);

  return (
    <div style={{
      backgroundColor: 'var(--bg-card, #0f172a)',
      border: '1px solid var(--border-color, #1e293b)',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      color: '#fff'
    }}>
      {/* Шапка блока */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Кнопки Экспорта/Импорта */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleExportJSON}
              title="Экспортировать портфель в JSON"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid #334155',
                color: '#94a3b8',
                padding: '0.4rem 0.6rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.75rem'
              }}
            >
              <Download size={14} /> JSON
            </button>
            <label title="Импортировать портфель из JSON" style={{
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid #334155',
              color: '#94a3b8',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem'
            }}>
              <Upload size={14} /> Импорт
              <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Общая стоимость</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#4ade80' }}>
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Форма добавления */}
      <form onSubmit={handleAddAsset} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select
          value={selectedCoinId}
          onChange={(e) => setSelectedCoinId(e.target.value)}
          style={{
            flex: 1,
            minWidth: '180px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#fff',
            padding: '0.6rem 0.85rem',
            borderRadius: '10px',
            outline: 'none'
          }}
        >
          {coins.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.symbol.toUpperCase()}) — ${c.current_price.toLocaleString()}
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
            flex: 1,
            minWidth: '180px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            color: '#fff',
            padding: '0.6rem 0.85rem',
            borderRadius: '10px',
            outline: 'none'
          }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: '10px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Plus size={18} /> Добавить
        </button>
      </form>

      {/* Список активов */}
      {portfolio.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
          Портфель пуст. Добавьте свою первую монету выше!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {portfolio.map(item => {
            const coin = coins.find(c => c.id === item.coinId);
            if (!coin) return null;
            const itemTotal = coin.current_price * item.amount;

            return (
              <div key={item.coinId} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '0.75rem 1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={coin.image} alt={coin.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <div>
                    <span style={{ fontWeight: '700', color: '#fff' }}>{coin.name}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '0.5rem' }}>{item.amount} {coin.symbol.toUpperCase()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '700', color: '#e2e8f0' }}>${itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <button
                    onClick={() => handleRemoveAsset(item.coinId)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};