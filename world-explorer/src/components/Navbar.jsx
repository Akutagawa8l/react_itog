import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Film } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon"><Film size={20} /></div>
          <span>CinePulse</span>
        </Link>

        <div className="nav-controls">
          <nav className="nav-links">
            <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
              Каталог
            </Link>
            <Link to="/favorites" className={`nav-link ${pathname === '/favorites' ? 'active' : ''}`}>
              Избранное
            </Link>
          </nav>

          <button onClick={toggleTheme} className="theme-btn" aria-label="Сменить тему">
            {darkMode ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
