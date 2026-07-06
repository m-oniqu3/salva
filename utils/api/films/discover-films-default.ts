/* eslint-disable @typescript-eslint/no-explicit-any */
import { TMDBFilm } from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

type Props = {
  genreKey?: number;
  page?: number;
};

export type DiscoverFilmsResult = {
  films: TMDBFilm[];
  page: number;
  totalPages: number;
};

export async function discoverFilms(
  props: Props,
): Promise<DiscoverFilmsResult> {
  const genreKey = props?.genreKey;
  const page = props?.page ?? 1;

  const params = new URLSearchParams({ page: String(page) });
  if (genreKey) params.set("with_genres", String(genreKey));

  const [moviesRes, tvRes] = await Promise.all([
    fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
      headers: { Authorization: "Bearer " + ACCESS_TOKEN },
    }),
    fetch(`${BASE_URL}/discover/tv?${params.toString()}`, {
      headers: { Authorization: "Bearer " + ACCESS_TOKEN },
    }),
  ]);

  const movies = await moviesRes.json();
  const tv = await tvRes.json();

  const films = ([] as any[])
    .concat(movies.results ?? [])
    .concat(tv.results ?? [])
    .reduce((acc: TMDBFilm[], cur) => {
      if (!cur.poster_path) return acc;

      const mediaType = "title" in cur ? "movie" : "tv";

      acc.push({
        id: cur.id,
        title: mediaType === "movie" ? cur.title : cur.name,
        poster_path: cur.poster_path,
        media_type: mediaType,
      });

      return acc;
    }, []);

  // TMDB's movie/tv result counts differ, so take the smaller total_pages
  // to guarantee both endpoints have data for every page we request.
  // only the totalPages line changes
  const totalPages =
    Math.max(movies.total_pages ?? 0, tv.total_pages ?? 0) || 1;

  return { films, page, totalPages };
}
