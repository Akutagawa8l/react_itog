import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Tv } from 'lucide-react';
import { getMovieById } from '../api/moviesApi';

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    getMovieById(id).then(setMovie);
  }, [id]);

  if (!movie) return <div className="loader">Загрузка фильма...</div>;

  const stats = [
    { icon: Star, label: 'Рейтинг', value: movie.rating?.average ? `${movie.rating.average} / 10` : 'Н/Д' },
    { icon: Calendar, label: 'Год', value: movie.premiered?.slice(0, 4) || 'Н/Д' },
    { icon: Clock, label: 'Серия', value: movie.runtime ? `${movie.runtime} мин` : 'Н/Д' },
    { icon: Tv, label: 'Канал', value: movie.network?.name || movie.language },
  ];

  return (
    <div className="detail-wrapper">
      <Link to="/" className="back-btn"><ArrowLeft size={16} /> Назад в каталог</Link>

      <div className="detail-card">
        <div className="detail-banner">
          <img src={movie.image?.original} alt="" />
        </div>

        <div className="detail-body">
          <img src={movie.image?.original || movie.image?.medium} alt={movie.name} className="detail-poster" />

          <div className="detail-content">
            <div className="movie-tags">
              {movie.genres?.map((g) => (
                <span key={g} className="genre-chip active" style={{ cursor: 'default' }}>{g}</span>
              ))}
            </div>

            <h1 className="detail-title">{movie.name}</h1>

            <div className="stats-grid">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="stat-box">
                  <div className="stat-label"><Icon size={14} color="var(--accent)" /> {label}</div>
                  <div className="stat-value">{value}</div>
                </div>
              ))}
            </div>

            <p className="detail-summary">
              {movie.summary?.replace(/<[^>]+>/g, '') || 'Описание отсутствует.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
