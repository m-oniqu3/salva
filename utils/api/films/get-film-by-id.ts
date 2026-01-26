import { Result } from "@/types/result";
import { MediaType, Movie, TVShow } from "@/types/tmdb";

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
    const response = await fetch(`${BASE_URL}/${media_type}/${filmID}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    assertTMDBResponse(response, "Fetch Request");

    const filmDetails = (await response.json()) as FilmByType[T];

    return {
      data: filmDetails ?? null,
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
