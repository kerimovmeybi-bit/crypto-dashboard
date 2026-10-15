import { useEffect, useState } from 'react';
import type { CryptoCoin } from './types/crypto';
import { fetchTopCoins } from './services/cryptoApi';
import { Header } from './components/Header';
import { CoinCard } from './components/CoinCard';
import { CoinModal } from './components/CoinModal';
import { Converter } from './components/Converter';
import { Footer } from './components/Footer';
import { Loader2, RefreshCw, Star, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export function App() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Тема сайта: 'dark' | 'light'
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

  // Переключение темы и запись в HTML
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

  const filteredCoins = coins.filter((coin) => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || favorites.includes(coin.id);
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-main)',
      backgroundImage: 'var(--bg-radial)',
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

        {!loading && !error && coins.length > 0 && <Converter coins={coins} />}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.3rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
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
                color: activeTab === 'all' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
                color: activeTab === 'favorites' ? '#fff' : 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Star size={16} /> Избранное ({favorites.length})
            </button>
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
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Обновить
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '6rem 0', gap: '1rem', color: 'var(--text-secondary)' }}>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredCoins.map((coin) => (
              <CoinCard 
                key={coin.id} 
                coin={coin} 
                isFavorite={favorites.includes(coin.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedCoin(coin)}
              />
            ))}
          </motion.div>
        )}

        <CoinModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      </div>

      <Footer />
    </div>
  );
}

export default App;