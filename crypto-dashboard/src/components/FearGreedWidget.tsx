import React, { useEffect, useState } from 'react';
import { fetchFearAndGreed, type FearGreedData } from '../services/fearGreedApi';
import { Gauge } from 'lucide-react';

export const FearGreedWidget: React.FC = () => {
  const [fng, setFng] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchFearAndGreed()
      .then(setFng)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !fng) return null;

  const value = parseInt(fng.value, 10);

  // Цвет в зависимости от уровня
  const getColor = (val: number) => {
    if (val <= 25) return '#ef4444'; // Extreme Fear (Красный)
    if (val <= 45) return '#f97316'; // Fear (Оранжевый)
    if (val <= 55) return '#eab308'; // Neutral (Желтый)
    if (val <= 75) return '#84cc16'; // Greed (Салатовый)
    return '#22c55e'; // Extreme Greed (Зеленый)
  };

  const currentColor = getColor(value);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      backgroundColor: 'var(--bg-card, #0f172a)',
      border: '1px solid var(--border-color, #1e293b)',
      borderRadius: '16px',
      padding: '0.85rem 1.25rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '42px',
        height: '42px',
        borderRadius: '12px',
        backgroundColor: `${currentColor}20`,
        color: currentColor
      }}>
        <Gauge size={24} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)', fontWeight: '600' }}>
            Индекс страха и жадности
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: currentColor }}>
            {fng.value_classification} ({value}/100)
          </span>
        </div>

        {/* Прогресс-бар */}
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#1e293b',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: currentColor,
            borderRadius: '4px',
            transition: 'width 0.5s ease'
          }} />
        </div>
      </div>
    </div>
  );
};