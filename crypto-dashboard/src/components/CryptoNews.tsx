import React, { useEffect, useState } from 'react';
import { fetchCryptoNews, type CryptoArticle } from '../services/newsApi';
import { Newspaper, ExternalLink, Clock, Loader2 } from 'lucide-react';

export const CryptoNews: React.FC = () => {
  const [news, setNews] = useState<CryptoArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCryptoNews()
      .then(setNews)
      .finally(() => setLoading(false));
  }, []);

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
      {/* Шапка блока */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa'
        }}>
          <Newspaper size={22} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>Лента новостей</h3>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Актуальные события рынка в реальном времени</span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem', color: '#94a3b8' }}>
          <Loader2 className="animate-spin" size={20} color="#60a5fa" />
          <span>Загрузка последних новостей...</span>
        </div>
      ) : news.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#64748b' }}>
          Не удалось подгрузить новости. Попробуйте позже.
        </div>
      ) : (
        /* Сетка новостей */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {news.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid #1e293b',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#1e293b';
              }}
            >
              <h4 style={{
                margin: '0 0 1rem 0',
                fontSize: '0.95rem',
                fontWeight: '600',
                lineHeight: '1.4',
                color: '#f8fafc',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.title}
              </h4>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '600' }}>
                  {item.source}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={12} /> {item.published_at}
                  </span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};