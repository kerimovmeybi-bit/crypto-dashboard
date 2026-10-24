import React from 'react';
import { Search, Sun, Moon, TrendingUp, Wallet, Bell, Scale, Newspaper, Coins, Building2 } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  theme,
  onToggleTheme,
}) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navItems = [
    { id: 'section-converter', label: 'Конвертер', icon: TrendingUp },
    { id: 'section-portfolio', label: 'Портфель', icon: Wallet },
    { id: 'section-alerts', label: 'Алерты', icon: Bell },
    { id: 'section-compare', label: 'Сравнение', icon: Scale },
    { id: 'section-stocks', label: 'Акции компаний', icon: Building2 },
    { id: 'section-news', label: 'Новости', icon: Newspaper },
    { id: 'section-market', label: 'Рынок', icon: Coins },
  ];

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {/* Верхняя панель: Логотип, Поиск, Переключатель темы */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Логотип */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)'
          }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
                Crypto Market
              </h1>
              <span style={{
                padding: '0.15rem 0.5rem',
                fontSize: '0.65rem',
                fontWeight: '700',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                borderRadius: '6px',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                • LIVE
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Live Price Tracker & Stock Analytics</span>
          </div>
        </div>

        {/* Поиск и переключатель темы */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, justifyContent: 'flex-end', maxWidth: '450px' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '320px'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Поиск монеты..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                color: '#fff',
                fontSize: '0.85rem',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={onToggleTheme}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Быстрое навигационное меню */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                color: '#cbd5e1',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              <Icon size={14} color="#818cf8" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};