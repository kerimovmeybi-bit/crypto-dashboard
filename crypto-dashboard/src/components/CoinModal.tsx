import React, { useEffect, useState } from 'react';
import type { CryptoCoin, CoinTicker } from '../types/crypto';
import { fetchCoinTickers, fetchCoinMarketChart } from '../services/cryptoApi';
import { X, ExternalLink, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface CoinModalProps {
  coin: CryptoCoin | null;
  onClose: () => void;
}

export const CoinModal: React.FC<CoinModalProps> = ({ coin, onClose }) => {
  const [tickers, setTickers] = useState<CoinTicker[]>([]);
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [amountUsd, setAmountUsd] = useState<number>(1000);
  const [feePercentage, setFeePercentage] = useState<number>(0.1); // Комиссия одной сделки (по умолчанию 0.1%)

  useEffect(() => {
    if (coin) {
      setLoading(true);
      
      Promise.all([
        fetchCoinTickers(coin.id),
        fetchCoinMarketChart(coin.id)
      ])
        .then(([tickerData, pricesData]) => {
          setTickers(tickerData);
          
          const formatted = pricesData.map(([timestamp, price]) => {
            const date = new Date(timestamp);
            return {
              time: `${date.getDate()}.${date.getMonth() + 1} ${date.getHours()}:00`,
              price: Number(price.toFixed(2))
            };
          });
          setChartData(formatted);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [coin]);

  if (!coin) return null;

  const prices = tickers.map((t: any) => t.last).filter((price) => typeof price === 'number' && price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  // Грязный спред без комиссий (%)
  const rawSpread = minPrice && maxPrice && minPrice > 0 
    ? ((maxPrice - minPrice) / minPrice) * 100 
    : 0;

  // Расчет чистой прибыли с учетом комиссий:
  // Покупка по minPrice с комиссией -> Перевод -> Продажа по maxPrice с комиссией (всего 2 комиссии)
  const totalFeePercent = feePercentage * 2;
  const netSpread = rawSpread - totalFeePercent;
  const netProfit = (amountUsd * netSpread) / 100;

  const isPositive = coin.price_change_percentage_24h >= 0;
  const strokeColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(6px)',
      padding: '1rem'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '650px',
        borderRadius: '24px',
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        padding: '2rem',
        color: '#fff',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '1.25rem',
            top: '1.25rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '50%',
            padding: '0.5rem',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Шапка модалки */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <img src={coin.image} alt={coin.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>{coin.name}</h2>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase' }}>
              {coin.symbol}
            </span>
          </div>
        </div>

        {/* Интерактивный График цен (7 дней) */}
        <div style={{
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          padding: '1rem 0.5rem 0.5rem 0',
          marginBottom: '1.5rem',
          border: '1px solid #1e293b'
        }}>
          <h4 style={{ margin: '0 0 1rem 1rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: '600' }}>
            📈 Динамика цены за 7 дней
          </h4>
          
          <div style={{ width: '100%', height: '220px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#94a3b8' }}>
                Загрузка графика...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="#475569" fontSize={10} orientation="right" tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '0.8rem' }}
                    itemStyle={{ color: strokeColor, fontWeight: '700' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Цена']}
                  />
                  <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill="url(#chartGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#64748b' }}>
                Данные графика недоступны
              </div>
            )}
          </div>
        </div>

        {/* 24h High / Low */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <TrendingUp size={14} /> 24h High
            </span>
            <p style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0.3rem 0 0 0' }}>
              ${coin.high_24h ? coin.high_24h.toLocaleString() : '—'}
            </p>
          </div>
          <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1rem', borderRadius: '16px', border: '1px solid #1e293b' }}>
            <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <TrendingDown size={14} /> 24h Low
            </span>
            <p style={{ fontSize: '1.15rem', fontWeight: '700', margin: '0.3rem 0 0 0' }}>
              ${coin.low_24h ? coin.low_24h.toLocaleString() : '—'}
            </p>
          </div>
        </div>

        {/* Обновленный калькулятор арбитража с комиссией */}
        {minPrice && maxPrice && minPrice !== maxPrice && (
          <div style={{
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#a5b4fc', fontWeight: '600', fontSize: '0.9rem' }}>
              <Calculator size={18} />
              Калькулятор арбитражной прибыли (с учетом комиссий)
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '130px' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Сумма сделки ($)</label>
                <input
                  type="number"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(Math.max(0, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    color: '#fff',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '110px' }}>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Комиссия биржи (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={feePercentage}
                  onChange={(e) => setFeePercentage(Math.max(0, Number(e.target.value)))}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    color: '#fff',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '140px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Чистый Спред / Профит</span>
                <span style={{
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: netProfit >= 0 ? '#4ade80' : '#f87171'
                }}>
                  {netProfit >= 0 ? '+' : ''}{netSpread.toFixed(2)}% (${netProfit.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Биржи */}
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '1rem' }}>
          🏛 Цены на биржах
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '1rem 0', color: '#94a3b8' }}>Загрузка цен с бирж...</div>
        ) : tickers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem 0', color: '#64748b' }}>Нет доступных данных с бирж</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tickers.map((ticker: any, index: number) => {
              const isBestBuy = minPrice !== null && ticker.last === minPrice && minPrice !== maxPrice;
              const isBestSell = maxPrice !== null && ticker.last === maxPrice && minPrice !== maxPrice;

              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    border: isBestBuy
                      ? '1px solid rgba(34, 197, 94, 0.4)'
                      : isBestSell
                      ? '1px solid rgba(59, 130, 246, 0.4)'
                      : '1px solid #1e293b',
                    backgroundColor: isBestBuy
                      ? 'rgba(20, 83, 45, 0.2)'
                      : isBestSell
                      ? 'rgba(30, 58, 138, 0.2)'
                      : 'rgba(30, 41, 59, 0.4)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '600', color: '#fff' }}>{ticker.market?.name || 'Биржа'}</span>

                      {isBestBuy && (
                        <span style={{
                          padding: '0.15rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          backgroundColor: 'rgba(34, 197, 94, 0.2)',
                          color: '#4ade80',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          borderRadius: '6px'
                        }}>
                          Выгодно купить
                        </span>
                      )}

                      {isBestSell && (
                        <span style={{
                          padding: '0.15rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          backgroundColor: 'rgba(59, 130, 246, 0.2)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px'
                        }}>
                          Выгодно продать
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      fontWeight: '700',
                      color: isBestBuy ? '#4ade80' : isBestSell ? '#60a5fa' : '#fff'
                    }}>
                      ${ticker.last ? ticker.last.toLocaleString() : '—'}
                    </span>
                    {ticker.trade_url && (
                      <a
                        href={ticker.trade_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};