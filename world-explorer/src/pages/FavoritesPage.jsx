import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowLeft } from 'lucide-react';
import { getMovies } from '../api/moviesApi';

export default function FavoritesPage() {
  const [movies, setMovies] = useState([]);
  const [favs, setFavs] = useState(() => JSON.parse(localStorage.getItem('favs') || '[]'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then(setMovies).finally(() => setLoading(false));
  }, []);

  const removeFav = (e, id) => {
    e.preventDefault();
    const next = favs.filter((x) => x !== id);
    setFavs(next);
    localStorage.setItem('favs', JSON.stringify(next));
  };

  if (loading) return <div className="loader">Загрузка...</div>;

  const savedMovies = movies.filter((m) => favs.includes(m.id));

  return (
    <div>
      <div className="controls-bar" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 900 }}>Моё избранное ({savedMovies.length})</h1>
        <Link to="/" className="back-btn" style={{ marginBottom: 0 }}>
          <ArrowLeft size={16} /> В каталог
        </Link>
      </div>

      {savedMovies.length === 0 ? (
        <div className="about-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Heart size={40} color="var(--muted)" style={{ margin: '0 auto 12px' }} />
          <h2>Список пока пуст</h2>
          <p style={{ marginBottom: '20px' }}>Нажимайте на сердечко на карточках фильмов, чтобы сохранить их сюда.</p>
          <Link to="/" className="btn-primary">Выбрать фильмы</Link>
        </div>
      ) : (
        <div className="movies-grid">
          {savedMovies.map((m) => (
            <Link key={m.id} to={`/movie/${m.id}`} className="movie-card">
              <img src={m.image?.medium} alt={m.name} className="movie-poster" />
              <div className="movie-gradient" />

              <button onClick={(e) => removeFav(e, m.id)} className="fav-btn" aria-label="Убрать из избранного">
                <Heart size={16} fill="#f43f5e" color="#f43f5e" />
              </button>

              {m.rating?.average && (
                <span className="rating-badge">
                  <Star size={13} fill="#fbbf24" /> {m.rating.average}
                </span>
              )}

              <div className="movie-info">
                <div className="movie-tags">
                  {m.genres?.slice(0, 2).map((g) => <span key={g} className="movie-tag">{g}</span>)}
                </div>
                <h2 className="movie-title">{m.name}</h2>
                <p className="movie-meta">{m.premiered?.slice(0, 4)} • {m.network?.name || m.language}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
