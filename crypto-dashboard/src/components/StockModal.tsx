import React, { useState } from 'react';
import type { StockCompany } from '../types/stock';
import { X, TrendingUp, TrendingDown, ExternalLink, Calculator } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

interface StockModalProps {
  stock: StockCompany | null;
  onClose: () => void;
}

// Функция для генерации ссылки на сайт биржи или поиска по тикеру
const getExchangeUrl = (exchangeName: string, symbol: string) => {
  const name = exchangeName.toLowerCase();
  if (name.includes('nasdaq')) return `https://www.nasdaq.com/market-activity/stocks/${symbol.toLowerCase()}`;
  if (name.includes('nyse')) return `https://www.nyse.com/quote/XNYS:${symbol}`;
  if (name.includes('xetra') || name.includes('frankfurt')) return `https://www.boerse-frankfurt.de/equity/${symbol}`;
  if (name.includes('lse') || name.includes('london')) return `https://www.londonstockexchange.com/stock/${symbol}`;
  if (name.includes('cboe')) return `https://www.cboe.com/`;
  return `https://www.google.com/search?q=${stockSymbolQuery(exchangeName, symbol)}`;
};

const stockSymbolQuery = (ex: string, sym: string) => encodeURIComponent(`${sym} stock on ${ex}`);

export const StockModal: React.FC<StockModalProps> = ({ stock, onClose }) => {
  const [tradeAmount, setTradeAmount] = useState<number>(1000);
  const [feePercent, setFeePercent] = useState<number>(0.1);

  if (!stock) return null;

  const isPositive = stock.change24h >= 0;

  const sortedExchanges = [...stock.exchanges].sort((a, b) => a.price - b.price);
  const minExchange = sortedExchanges[0];
  const maxExchange = sortedExchanges[sortedExchanges.length - 1];

  const grossSpread = maxExchange.price - minExchange.price;
  const rawSpreadPercent = (grossSpread / minExchange.price) * 100;
  
  const totalFeeDecimal = (feePercent * 2) / 100;
  const netSpreadPercent = rawSpreadPercent - (totalFeeDecimal * 100);
  const netProfitUsd = (tradeAmount * netSpreadPercent) / 100;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '540px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            color: '#fff',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Шапка модалки */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                fontSize: '0.9rem'
              }}>
                {stock.symbol.slice(0, 3)}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800' }}>{stock.name}</h2>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>{stock.symbol}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X size={22} />
            </button>
          </div>

          {/* График цен за 7 дней */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '16px',
            padding: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '0.75rem' }}>
              📈 Динамика цены за 7 дней
            </span>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stock.history}>
                  <defs>
                    <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="price" stroke={isPositive ? '#22c55e' : '#ef4444'} strokeWidth={2} fillOpacity={1} fill="url(#stockGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 24h High / Low */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: '700', display: 'block' }}>📈 24h High</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>${stock.high24h.toFixed(2)}</span>
            </div>
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: '700', display: 'block' }}>📉 24h Low</span>
              <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>${stock.low24h.toFixed(2)}</span>
            </div>
          </div>

          {/* Калькулятор арбитража */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '16px',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', fontWeight: '700', color: '#818cf8', marginBottom: '0.75rem' }}>
              <Calculator size={16} /> Калькулятор арбитражной прибыли (с учетом комиссий)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Сумма сделки ($)</span>
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  style={{ width: '100%', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.4rem 0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Комиссия биржи (%)</span>
                <input
                  type="number"
                  step="0.05"
                  value={feePercent}
                  onChange={(e) => setFeePercent(Number(e.target.value))}
                  style={{ width: '100%', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.4rem 0.5rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block', marginBottom: '0.2rem' }}>Чистый Спред / Профит</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: netSpreadPercent >= 0 ? '#4ade80' : '#f87171' }}>
                  {netSpreadPercent >= 0 ? '+' : ''}{netSpreadPercent.toFixed(2)}% (${netProfitUsd.toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* Список кликабельных бирж */}
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#cbd5e1' }}>🏦 Цены на биржах (Нажмите для перехода)</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stock.exchanges.map((ex, idx) => {
              const isBestBuy = ex.name === minExchange.name;
              const isBestSell = ex.name === maxExchange.name;
              const exchangeUrl = getExchangeUrl(ex.name, stock.symbol);

              return (
                <a
                  key={idx}
                  href={exchangeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: isBestBuy ? 'rgba(34, 197, 94, 0.12)' : isBestSell ? 'rgba(59, 130, 246, 0.12)' : 'rgba(15, 23, 42, 0.6)',
                    border: `1px solid ${isBestBuy ? 'rgba(34, 197, 94, 0.3)' : isBestSell ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textDecoration: 'none',
                    color: '#fff',
                    transition: 'transform 0.15s ease, background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01)';
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = isBestBuy ? 'rgba(34, 197, 94, 0.12)' : isBestSell ? 'rgba(59, 130, 246, 0.12)' : 'rgba(15, 23, 42, 0.6)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{ex.name}</span>
                    {isBestBuy && <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '6px', backgroundColor: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', fontWeight: '700' }}>Выгодно купить</span>}
                    {isBestSell && <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', fontWeight: '700' }}>Выгодно продать</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>${ex.price.toFixed(2)}</span>
                    <ExternalLink size={14} color="#60a5fa" />
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};