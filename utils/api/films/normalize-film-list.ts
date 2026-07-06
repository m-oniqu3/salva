import { FilmRecommendation, TMDBFilm } from "@/types/tmdb";

export function normalizeFilmList(data: FilmRecommendation[]): TMDBFilm[] {
  return data.map((film) => {
    const title = "title" in film ? film.title! : film.name!;
    return {
      id: film.id,
      title,
      poster_path: film.poster_path,
      media_type: film.media_type ?? ("title" in film ? "movie" : "tv"),
    };
  });
}
