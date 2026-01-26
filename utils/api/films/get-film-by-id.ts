import { Result } from "@/types/result";
import { MediaType, Movie, TMDBConfig, TVShow } from "@/types/tmdb";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

type FilmByType = {
  movie: Movie;
  tv: TVShow;
};

export async function getFilmById<T extends MediaType>(
  media_type: T,
  filmID: number,
): Result<FilmByType[T] | null> {
  try {
    // Fetch film and config in parallel
    const [filmRes, configRes] = await Promise.all([
      fetch(`${BASE_URL}/${media_type}/${filmID}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }),
      fetch(`${BASE_URL}/configuration`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }),
    ]);

    assertTMDBResponse(filmRes, "Fetch Film By ID");
    assertTMDBResponse(configRes, "Fetch TMDB Config");

    const film = (await filmRes.json()) as FilmByType[T];
    const config = (await configRes.json()) as TMDBConfig;

    if (!film || !config) return { data: null, error: null };

    // Compute poster URL
    const poster_path = film.poster_path
      ? `${config.images.base_url}w500${film.poster_path}`
      : null;

    const backdrop_path = film.backdrop_path
      ? `${config.images.base_url}w780${film.backdrop_path}`
      : null;

    return {
      data: { ...film, poster_path, backdrop_path },
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
