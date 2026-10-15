import React from 'react';
import { Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      marginTop: '4rem',
      padding: '2rem 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      color: '#9ca3af',
      fontSize: '0.9rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Code2 size={18} color="#6366f1" />
        <span>Разработано с помощью React & TypeScript</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#787b7e', fontWeight: '500' }}>
        <span>Сделано разработчиком:</span>
        <span style={{ color: '#f59e0b', fontWeight: '600' }}>Керимли Мейбулла</span>
        <Heart size={15} color="#ef4444" fill="#ef4444" style={{ margin: '0 0.2rem' }} />
      </div>
    </footer>
  );
};