import {
  TMDBConfig,
  TMDBFilm,
  TMDBImagesConfig,
  TMDBImageSize,
} from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getFilms(q: string): Promise<TMDBFilm[] | null> {
  const filmQuery = fetch(BASE_URL + "/search/movie?query=" + q, {
    headers: { Authorization: "Bearer " + ACCESS_TOKEN },
  });

  const configQuery = fetch("https://api.themoviedb.org/3/configuration", {
    headers: { Authorization: "Bearer " + ACCESS_TOKEN },
  });

  const [filmRes, configRes] = await Promise.all([filmQuery, configQuery]);

  assertTMDBResponse(filmRes, "Film request");
  assertTMDBResponse(configRes, "Config request");

  const films = await filmRes.json();
  const config: TMDBConfig = await configRes.json();

  if (!films) {
    return null;
  }

  //get images

  const results: TMDBFilm[] = films.results.reduce(
    (acc: TMDBFilm[], cur: TMDBFilm) => {
      if (!cur.poster_path) return acc;

      acc.push({
        id: cur.id,
        title: cur.title,
        poster_path: buildTMDBImageUrl(config.images, "w500", cur.poster_path),
      });

      return acc;
    },
    [] as TMDBFilm[]
  );

  return results;
}

function assertTMDBResponse(
  response: Response,
  label: string
): asserts response {
  if (response.ok) return;

  const status = response.status;

  if (status === 401) {
    throw new Error(`${label}: Invalid TMDB API key`);
  }

  if (status === 429) {
    throw new Error(`${label}: Too many requests. Please slow down.`);
  }

  throw new Error(`${label}: TMDB request failed (${status})`);
}

export function buildTMDBImageUrl(
  config: TMDBImagesConfig,
  size: TMDBImageSize,
  path: string
) {
  return `${config.secure_base_url}${size}${path}`;
}
