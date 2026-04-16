export const TMDB_GENRE_MAP: Record<number, string> = {
  // Movies (translated from German)
  28: "Action",
  12: "Adventure", // Abenteuer
  16: "Animation",
  35: "Comedy", // Komödie
  80: "Crime", // Krimi
  99: "Documentary", // Dokumentarfilm
  18: "Drama",
  10751: "Family", // Familie
  14: "Fantasy",
  36: "History", // Historie
  27: "Horror",
  10402: "Music", // Musik
  9648: "Mystery",
  10749: "Romance", // Liebesfilm
  878: "Science Fiction",
  10770: "Drama", // TV-Film → fallback
  53: "Thriller",
  10752: "War", // Kriegsfilm
  37: "Western",

  // TV
  10759: "Action", // Action & Adventure → normalize
  10762: "Kids",
  10763: "News",
  10764: "Reality",
  10765: "Science Fiction", // Sci-Fi & Fantasy
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
};
export type Genre = (typeof TMDB_GENRE_MAP)[number];
