/* eslint-disable @typescript-eslint/no-explicit-any */
import { TMDBFilm } from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export type SearchFilmsResult = {
  films: TMDBFilm[];
  page: number;
  totalPages: number;
};

export async function searchFilms(
  query: string,
  page: number = 1,
): Promise<SearchFilmsResult> {
  const params = new URLSearchParams({ query, page: String(page) });

  const response = await fetch(
    `${BASE_URL}/search/multi?${params.toString()}`,
    { headers: { Authorization: "Bearer " + ACCESS_TOKEN } },
  );

  const data = await response.json();

  const films: TMDBFilm[] = (data.results ?? []).reduce(
    (acc: TMDBFilm[], cur: any) => {
      if (cur.media_type !== "movie" && cur.media_type !== "tv") return acc;
      if (!cur.poster_path) return acc;

      acc.push({
        id: cur.id,
        title: cur.media_type === "movie" ? cur.title : cur.name,
        poster_path: cur.poster_path,
        media_type: cur.media_type,
      });

      return acc;
    },
    [],
  );

  return {
    films,
    page,
    totalPages: data.total_pages ?? 1,
  };
}
