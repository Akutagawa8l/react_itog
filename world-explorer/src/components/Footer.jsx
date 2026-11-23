import { Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand" style={{ fontSize: '16px' }}>
          <Film size={18} color="var(--accent)" />
          <span>CinePulse</span>
        </div>
        <p>© 2026 CinePulse. Все права защищены.</p>
        <div style={{ display: 'flex', gap: '18px' }}>
          <Link to="/">Каталог</Link>
          <Link to="/favorites">Избранное</Link>
        </div>
      </div>
    </footer>
  );
}
