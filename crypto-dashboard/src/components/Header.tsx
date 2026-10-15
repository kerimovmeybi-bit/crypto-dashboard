import React from 'react';
import { Coins, Search, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

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
  onToggleTheme 
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        marginBottom: '2rem',
        boxShadow: '0 8px 32px var(--shadow-color)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          padding: '0.6rem',
          borderRadius: '14px',
          display: 'flex',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
        }}>
          <Coins size={28} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Crypto Market
          </h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Live Price Tracker</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Поиск монеты..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem 0.75rem 2.8rem',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              outline: 'none',
              fontSize: '0.9rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Кнопка переключения темы */}
        <button
          onClick={onToggleTheme}
          style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.65rem',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {theme === 'dark' ? <Sun size={20} color="#f59e0b" /> : <Moon size={20} color="#6366f1" />}
        </button>
      </div>
    </motion.header>
  );
};