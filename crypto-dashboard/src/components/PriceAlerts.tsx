import React, { useState, useEffect } from 'react';
import type { CryptoCoin } from '../types/crypto';
import { Bell, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface AlertItem {
  id: string;
  coinId: string;
  coinSymbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
}

interface PriceAlertsProps {
  coins: CryptoCoin[];
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({ coins }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>(() => {
    const saved = localStorage.getItem('crypto_price_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCoinId, setSelectedCoinId] = useState<string>(coins[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('crypto_price_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    if (coins.length > 0 && !selectedCoinId) {
      setSelectedCoinId(coins[0].id);
    }
  }, [coins, selectedCoinId]);

  // Проверка цен для срабатывания алертов
  useEffect(() => {
    if (coins.length === 0 || alerts.length === 0) return;

    alerts.forEach(alert => {
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) return;

      const triggered =
        (alert.condition === 'above' && coin.current_price >= alert.targetPrice) ||
        (alert.condition === 'below' && coin.current_price <= alert.targetPrice);

      if (triggered) {
        setToastMessage(`🚨 Алерт сработал! ${coin.name} достигла $${alert.targetPrice.toLocaleString()}`);
        // Удаляем сработавший алерт, чтобы не спамить
        setAlerts(prev => prev.filter(a => a.id !== alert.id));

        setTimeout(() => {
          setToastMessage(null);
        }, 5000);
      }
    });
  }, [coins, alerts]);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    const coin = coins.find(c => c.id === selectedCoinId);
    if (!coin || isNaN(priceNum) || priceNum <= 0) return;

    const newAlert: AlertItem = {
      id: Date.now().toString(),
      coinId: coin.id,
      coinSymbol: coin.symbol.toUpperCase(),
      targetPrice: priceNum,
      condition,
    };

    setAlerts(prev => [...prev, newAlert]);
    setTargetPrice('');
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-card, #0f172a)',
      border: '1px solid var(--border-color, #1e293b)',
      borderRadius: '20px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      color: '#fff',
      position: 'relative'
    }}>
      {/* Toast уведомление при срабатывании */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 100,
          backgroundColor: '#22c55e',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontWeight: '600',
          animation: 'fadeIn 0.3s ease'
        }}>
          <CheckCircle2 size={20} />
          {toastMessage}
        </div>
      )}

      {/* Шапка блока */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(234, 179, 8, 0.15)',
          color: '#eab308'
        }}>
          <Bell size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Ценовые алерты</h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Уведомления о достижении целевой цены</span>
        </div>
      </div>

      {/* Форма добавления */}
      <form onSubmit={handleAddAlert} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <select
          value={selectedCoinId}
          onChange={(e) => setSelectedCoinId(e.target.value)}
          style={{
            flex: '2',
            minWidth: '150px',
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
              {coin.name} (${coin.current_price.toLocaleString()})
            </option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
          style={{
            flex: '1.5',
            minWidth: '130px',
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
          <option value="above">Вырастет выше</option>
          <option value="below">Упадет ниже</option>
        </select>

        <input
          type="number"
          step="any"
          placeholder="Цена ($)"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          style={{
            flex: '1.5',
            minWidth: '120px',
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
            minWidth: '110px',
            backgroundColor: '#eab308',
            border: 'none',
            borderRadius: '12px',
            padding: '0.7rem 1rem',
            color: '#0f172a',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Создать
        </button>
      </form>

      {/* Список активных алертов */}
      {alerts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1rem 0', color: '#64748b', fontSize: '0.85rem' }}>
          Нет активных алертов. Создайте первый выше!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
          {alerts.map(alert => {
            const coin = coins.find(c => c.id === alert.coinId);
            return (
              <div key={alert.id} style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid #1e293b',
                borderRadius: '14px',
                padding: '0.85rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
                    {coin ? coin.name : alert.coinSymbol}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {alert.condition === 'above' ? '📈 Выше' : '📉 Ниже'} ${alert.targetPrice.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveAlert(alert.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '0.2rem'
                  }}
                  title="Удалить алерт"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};