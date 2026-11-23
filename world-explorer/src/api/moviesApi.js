import axios from 'axios';

const HORROR_MOVIES = [
  {
    id: 101,
    name: 'The Shining (Сияние)',
    genres: ['Horror', 'Thriller', 'Psychological'],
    rating: { average: 8.9 },
    premiered: '1980-05-23',
    runtime: 146,
    language: 'English',
    network: { name: 'Warner Bros.' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'Писатель Джек Торранс устраивается зимним смотрителем в уединённый горный отель «Оверлук», где зловещие силы постепенно сводят его с ума.',
  },
  {
    id: 102,
    name: 'Alien (Чужой)',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    rating: { average: 8.8 },
    premiered: '1979-05-25',
    runtime: 117,
    language: 'English',
    network: { name: '20th Century Fox' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'Экипаж космического буксира «Ностромо» перехватывает сигнал бедствия с неизвестной планеты и сталкивается с идеальным инопланетным хищником.',
  },
  {
    id: 103,
    name: 'The Thing (Нечто)',
    genres: ['Horror', 'Sci-Fi', 'Mystery'],
    rating: { average: 8.7 },
    premiered: '1982-06-25',
    runtime: 109,
    language: 'English',
    network: { name: 'Universal Pictures' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'Полярники на изолированной станции в Антарктиде находят во льдах инопланетный организм, способный принимать облик любого живого существа.',
  },
  {
    id: 104,
    name: 'The Conjuring (Заклятие)',
    genres: ['Horror', 'Supernatural', 'Mystery'],
    rating: { average: 8.3 },
    premiered: '2013-07-19',
    runtime: 112,
    language: 'English',
    network: { name: 'New Line Cinema' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'Исследователи паранормальных явлений Эд и Лоррейн Уоррены приезжают на старую ферму, чтобы помочь семье, терроризируемой тёмной сущностью.',
  },
  {
    id: 105,
    name: 'It (Оно)',
    genres: ['Horror', 'Supernatural', 'Thriller'],
    rating: { average: 8.1 },
    premiered: '2017-09-08',
    runtime: 135,
    language: 'English',
    network: { name: 'Warner Bros.' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'В городке Дерри начинают пропадать дети. Семеро подростков сталкиваются со своим главным кошмаром — древним злом в обличье клоуна Пеннивайза.',
  },
  {
    id: 106,
    name: 'A Quiet Place (Тихое место)',
    genres: ['Horror', 'Sci-Fi', 'Thriller'],
    rating: { average: 8.0 },
    premiered: '2018-04-06',
    runtime: 90,
    language: 'English',
    network: { name: 'Paramount Pictures' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'Семья пытается выжить в постапокалиптическом мире, населённом слепыми монстрами, которые мгновенно атакуют на любой малейший звук.',
  },
  {
    id: 107,
    name: 'Scream (Крик)',
    genres: ['Horror', 'Slasher', 'Mystery'],
    rating: { average: 8.2 },
    premiered: '1996-12-20',
    runtime: 111,
    language: 'English',
    network: { name: 'Dimension Films' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'В тихом городке Вудсборо появляется убийца в маске Призрачного лица, который проверяет своих жертв на знание правил фильмов ужасов.',
  },
  {
    id: 108,
    name: 'A Nightmare on Elm Street',
    genres: ['Horror', 'Slasher', 'Supernatural'],
    rating: { average: 8.4 },
    premiered: '1984-11-09',
    runtime: 91,
    language: 'English',
    network: { name: 'New Line Cinema' },
    image: {
      medium: 'https://unsplash.com',
      original: 'https://unsplash.com',
    },
    summary: 'Подростки с улицы Вязов начинают видеть один и тот же кошмар, в котором человек с лезвиями на перчатке охотится за ними во сне.',
  },
];

let cachedMovies = null;

export const getMovies = async () => {
  if (cachedMovies) return cachedMovies;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1500);

  try {
    const response = await axios.get('https://tvmaze.com', {
      signal: controller.signal,
    });
    clearTimeout(timer);
    const apiShows = Array.isArray(response.data)
      ? response.data.map((item) => item.show).filter((show) => show?.image?.medium)
      : [];
    cachedMovies = apiShows.length > 0 ? [...HORROR_MOVIES, ...apiShows] : HORROR_MOVIES;
  } catch {
    clearTimeout(timer);
    cachedMovies = HORROR_MOVIES;
  }

  return cachedMovies;
};

export const getMovieById = async (id) => {
  const list = await getMovies();
  return list.find((m) => String(m.id) === String(id)) || HORROR_MOVIES;
};
