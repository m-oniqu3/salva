import { TMDBFilm } from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

type Props = {
  genreKey?: number;
};

export async function defaultDiscoverFilms(
  props: Props,
): Promise<TMDBFilm[] | null> {
  const genreKey = props?.genreKey;

  const genreAdditive = genreKey ? `?with_genres=${genreKey}` : "";

  const [moviesRes, tvRes] = await Promise.all([
    fetch(`${BASE_URL}/discover/movie${genreAdditive}`, {
      headers: { Authorization: "Bearer " + ACCESS_TOKEN },
    }),
    fetch(`${BASE_URL}/discover/tv${genreAdditive}`, {
      headers: { Authorization: "Bearer " + ACCESS_TOKEN },
    }),
  ]);

  const movies = await moviesRes.json();
  const tv = await tvRes.json();

  const films = Array(movies.results)
    .concat(tv.results)
    .reduce((acc: TMDBFilm[], cur) => {
      // if (cur.media_type !== "movie" && cur.media_type !== "tv") return acc;
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

  if (!films) return null;

  return films;
}
