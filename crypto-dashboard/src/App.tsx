import React, { useEffect, useState } from 'react';
import type { CryptoCoin } from './types/crypto';
import { fetchTopCoins } from './services/cryptoApi';
import { Header } from './components/Header';
import { CoinCard } from './components/CoinCard';
import { CoinModal } from './components/CoinModal';
import { Converter } from './components/Converter';
import { FearGreedWidget } from './components/FearGreedWidget';
import { PortfolioTracker } from './components/PortfolioTracker';
import { PriceAlerts } from './components/PriceAlerts';
import { CryptoNews } from './components/CryptoNews';
import { Footer } from './components/Footer';
import { Loader2, RefreshCw, Star, Layers, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type SortOption = 'market_cap_desc' | 'price_desc' | 'price_asc' | 'change_desc' | 'change_asc';

export function App() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap_desc');

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('crypto_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('crypto_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('crypto_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTopCoins();
      setCoins(data);
    } catch (err) {
      setError('Не удалось загрузить данные криптовалют.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    localStorage.setItem('crypto_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (coinId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(coinId) ? prev.filter(id => id !== coinId) : [...prev, coinId]
    );
  };

  const filteredAndSortedCoins = coins
    .filter((coin) => {
      const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'all' || favorites.includes(coin.id);
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      if (sortBy === 'price_desc') return b.current_price - a.current_price;
      if (sortBy === 'price_asc') return a.current_price - b.current_price;
      if (sortBy === 'change_desc') return b.price_change_percentage_24h - a.price_change_percentage_24h;
      if (sortBy === 'change_asc') return a.price_change_percentage_24h - b.price_change_percentage_24h;
      return b.market_cap - a.market_cap;
    });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b0f19',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
      padding: '2rem 1.5rem 0 1.5rem',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <FearGreedWidget />

        {!loading && !error && coins.length > 0 && (
          <>
            <Converter coins={coins} />
            <PortfolioTracker coins={coins} />
            <PriceAlerts coins={coins} />
            <CryptoNews />
          </>
        )}

        {/* Панель управления */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'all' ? '#6366f1' : 'transparent',
                color: activeTab === 'all' ? '#fff' : '#94a3b8',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Layers size={16} /> Все монеты
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'favorites' ? '#6366f1' : 'transparent',
                color: activeTab === 'favorites' ? '#fff' : '#94a3b8',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Star size={16} /> Избранное ({favorites.length})
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.5rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <ArrowUpDown size={16} color="#94a3b8" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="market_cap_desc" style={{ background: '#0f172a' }}>По Капитализации</option>
                <option value="price_desc" style={{ background: '#0f172a' }}>Сначала дорогие</option>
                <option value="price_asc" style={{ background: '#0f172a' }}>Сначала дешевые</option>
                <option value="change_desc" style={{ background: '#0f172a' }}>Лидеры роста (24h)</option>
                <option value="change_asc" style={{ background: '#0f172a' }}>Лидеры падения (24h)</option>
              </select>
            </div>

            <button
              onClick={loadCoins}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Обновить
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '6rem 0', gap: '1rem', color: '#94a3b8' }}>
            <Loader2 className="animate-spin" size={32} color="#6366f1" />
            <span style={{ fontSize: '0.95rem', fontWeight: '500' }}>Загружаем крипто-рынок...</span>
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem', borderRadius: '16px', textAlign: 'center', color: '#f87171' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            <AnimatePresence>
              {filteredAndSortedCoins.map((coin) => (
                <motion.div key={coin.id} variants={cardVariants} layout>
                  <CoinCard
                    coin={coin}
                    isFavorite={favorites.includes(coin.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedCoin(coin)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <CoinModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      </div>

      <Footer />
    </div>
  );
}

export default App;