import { Result } from "@/types/result";
import {
  Credits,
  MediaType,
  Movie,
  TMDBConfig,
  TMDBImagesConfig,
  TMDBImageSize,
  TVShow,
} from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

type FilmByType = {
  movie: Movie;
  tv: TVShow;
};

type FilmRec = {
  id: number;
  name?: string;
  title?: string;
  poster_path: string | null;
};

type FilmRecResponse = {
  results: FilmRec[];
};

export type FilmWithExtras<T> = {
  film: T;
  credits: Credits;
  similar: FilmRec[];
  recommendations: FilmRec[];
};

export async function getFilmById<T extends MediaType>(
  media_type: T,
  filmID: number,
): Result<FilmWithExtras<FilmByType[T]> | null> {
  try {
    const film_url = `${BASE_URL}/${media_type}/${filmID}?append_to_response=credits,similar,recommendations`;

    const filmQuery = fetch(film_url, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    const configQuery = fetch(`${BASE_URL}/configuration`, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    // Fetch film and config in parallel
    const [filmRes, configRes] = await Promise.all([filmQuery, configQuery]);

    assertTMDBResponse(filmRes, "Fetch Film By ID");
    assertTMDBResponse(configRes, "Fetch TMDB Config");

    const baseFilm = await filmRes.json();
    const config = (await configRes.json()) as TMDBConfig;

    if (!baseFilm || !config) return { data: null, error: null };

    const film: FilmByType[T] = {
      ...baseFilm,
      poster_path: buildTMDBImageUrl(
        config.images,
        "w500",
        baseFilm.poster_path,
      ),
      backdrop_path: buildTMDBImageUrl(
        config.images,
        "w1280",
        baseFilm.backdrop_path,
      ),
    };

    return {
      data: {
        film,
        credits: baseFilm.credits,
        similar: normalizeList(baseFilm.similar ?? [], config),
        recommendations: normalizeList(baseFilm.recommendations ?? [], config),
      },
      error: null,
    };
  } catch (error) {
    console.error("getFilmById failed:", error);

    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch film",
    };
  }
}

function normalizeList(data: FilmRecResponse, config: TMDBConfig) {
  return data.results
    .filter((film) => !film.poster_path)
    .map((film) => {
      const url = buildTMDBImageUrl(config.images, "w500", film.poster_path!);
      const title = "title" in film ? film.title! : film.name!;

      return { ...film, title, poster_path: url };
    });
}

// Checks response and throws appropriate errors
function assertTMDBResponse(
  response: Response,
  label: string,
): asserts response {
  if (response.ok) return;

  if (!response.ok) throw new Error("Film not found.");

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
  path: string,
) {
  return `${config.secure_base_url}${size}${path}`;
}
