import { TMDBFilm } from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchFilms(q: string): Promise<TMDBFilm[] | null> {
  const response = await fetch(BASE_URL + "/search/multi?query=" + q, {
    headers: { Authorization: "Bearer " + ACCESS_TOKEN },
  });

  const films = await response.json();

  if (!films) return null;

  // @ts-expect-error Type of `cur` is any
  const results: TMDBFilm[] = films.results.reduce((acc: TMDBFilm[], cur) => {
    if (cur.media_type !== "movie" && cur.media_type !== "tv") return acc;
    if (!cur.poster_path) return acc;

    acc.push({
      id: cur.id,
      title: cur.media_type === "movie" ? cur.title : cur.name,
      poster_path: cur.poster_path,
      media_type: cur.media_type,
    });

    return acc;
  }, []);

  return results;
}
