import { Result } from "@/types/result";
import { Credits, MediaType, Movie, TVShow } from "@/types/tmdb";
import formErrorMesage from "@utils/form-error-message";

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3";

type FilmByType = {
  movie: Movie;
  tv: TVShow;
};

export type FilmWithExtras<T> = {
  film: T;
  credits: Credits;
};

export async function getFilmById<T extends MediaType>(
  media_type: T,
  filmID: number,
): Result<FilmWithExtras<FilmByType[T]> | null> {
  try {
    const film_url = `${BASE_URL}/${media_type}/${filmID}?append_to_response=credits`;

    const response = await fetch(film_url, {
      headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
    });

    const film = await response.json();

    if (!film) return { data: null, error: null };

    return {
      data: { film, credits: film.credits },
      error: null,
    };
  } catch (error) {
    return formErrorMesage(error);
  }
}
