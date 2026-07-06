import { FilmRecommendation, MediaType, TMDBFilm } from "@/types/tmdb";
import { normalizeFilmList } from "@utils/api/films/normalize-film-list";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export type SimilarFilmsResult = {
  films: TMDBFilm[];
  page: number;
  totalPages: number;
};

export async function getSimilarFilms(
  media_type: MediaType,
  filmID: number,
  page: number = 1,
): Promise<SimilarFilmsResult> {
  const params = new URLSearchParams({ page: String(page) });

  const [similarRes, recommendationsRes] = await Promise.all([
    fetch(`${BASE_URL}/${media_type}/${filmID}/similar?${params.toString()}`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    }),
    fetch(
      `${BASE_URL}/${media_type}/${filmID}/recommendations?${params.toString()}`,
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } },
    ),
  ]);

  const similar = await similarRes.json();
  const recommendations = await recommendationsRes.json();

  const rawFilms: FilmRecommendation[] = ([] as FilmRecommendation[])
    .concat(similar.results ?? [])
    .concat(recommendations.results ?? []);

  const films = normalizeFilmList(rawFilms).filter((f) => f.poster_path);

  const totalPages =
    Math.max(similar.total_pages ?? 0, recommendations.total_pages ?? 0) || 1;

  return { films, page, totalPages };
}
