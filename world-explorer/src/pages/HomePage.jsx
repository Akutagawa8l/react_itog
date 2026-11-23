import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Heart, Play, Sparkles } from 'lucide-react';
import { getMovies } from '../api/moviesApi';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [favs, setFavs] = useState(() => JSON.parse(localStorage.getItem('favs') || '[]'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovies().then(setMovies).finally(() => setLoading(false));
  }, []);

  const toggleFav = (e, id) => {
    e.preventDefault();
    const next = favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
    setFavs(next);
    localStorage.setItem('favs', JSON.stringify(next));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-500">Загружаем коллекцию...</p>
      </div>
    );
  }

  const genres = ['All', ...new Set(movies.flatMap((m) => m.genres || []))];
  const hero = movies.find((m) => m.rating?.average >= 8.7) || movies[0];
  const filtered = movies.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) &&
      (genre === 'All' || m.genres?.includes(genre)) &&
      (!onlyFavs || favs.includes(m.id))
  );

  return (
    <div className="space-y-10">
      {/* Премиум Hero-баннер */}
      {hero && (
        <section className="relative overflow-hidden rounded-[2rem] bg-zinc-900 text-white shadow-2xl border border-white/10">
          <img
            src={hero.image?.original || hero.image?.medium}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35 blur-2xl scale-125 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/30" />

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md text-amber-300 border border-white/15">
                <Sparkles className="w-3.5 h-3.5" /> Премьера недели • ★ {hero.rating?.average}
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none">{hero.name}</h1>
              <p className="text-zinc-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
                {hero.summary?.replace(/<[^>]+>/g, '')}
              </p>
              <div className="pt-2">
                <Link
                  to={`/movie/${hero.id}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-semibold text-sm shadow-lg shadow-violet-600/35 transition transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white" /> Смотреть карточку
                </Link>
              </div>
            </div>

            <Link to={`/movie/${hero.id}`} className="hidden md:block relative group shrink-0">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-50 blur-xl group-hover:opacity-80 transition" />
              <img
                src={hero.image?.medium}
                alt={hero.name}
                className="relative w-44 rounded-2xl shadow-2xl ring-1 ring-white/25 transform group-hover:scale-105 transition duration-300"
              />
            </Link>
          </div>
        </section>
      )}

      {/* Панель управления */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>

          <button
            onClick={() => setOnlyFavs(!onlyFavs)}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold cursor-pointer transition ${
              onlyFavs
                ? 'border-rose-500/50 text-rose-500 bg-rose-500/10 shadow-sm'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-violet-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${onlyFavs ? 'fill-rose-500' : ''}`} />
            Избранное ({favs.length})
          </button>
        </div>

        {/* Жанры */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                genre === g
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 shadow'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500'
              }`}
            >
              {g === 'All' ? 'Все жанры' : g}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка постеров */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((m) => (
          <Link
            key={m.id}
            to={`/movie/${m.id}`}
            className="group relative rounded-3xl overflow-hidden bg-zinc-900 aspect-[2/3] shadow-md hover:shadow-2xl hover:shadow-violet-500/20 hover:ring-2 hover:ring-violet-500/60 transition-all duration-300"
          >
            <img
              src={m.image?.medium}
              alt={m.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent opacity-90" />

            {/* Верхние кнопки */}
            <button
              onClick={(e) => toggleFav(e, m.id)}
              className="absolute top-3.5 left-3.5 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${favs.includes(m.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            {m.rating?.average && (
              <span className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-black/50 text-amber-400 backdrop-blur-md border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {m.rating.average}
              </span>
            )}

            {/* Нижняя информация поверх постера */}
            <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1.5">
              <div className="flex gap-1.5">
                {m.genres?.slice(0, 2).map((g) => (
                  <span key={g} className="text-[11px] px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-sm">
                    {g}
                  </span>
                ))}
              </div>
              <h2 className="font-bold text-lg leading-snug line-clamp-1 group-hover:text-violet-300 transition">
                {m.name}
              </h2>
              <p className="text-xs text-zinc-400">
                {m.premiered?.slice(0, 4)} • {m.network?.name || m.language}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
