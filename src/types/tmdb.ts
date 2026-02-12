export type TMDBImageSize =
  | "w45"
  | "w92"
  | "w154"
  | "w185"
  | "w300"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "h632"
  | "original";

export interface TMDBImagesConfig {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: TMDBImageSize[];
  logo_sizes: TMDBImageSize[];
  poster_sizes: TMDBImageSize[];
  profile_sizes: TMDBImageSize[];
  still_sizes: TMDBImageSize[];
}

export type TMDBChangeKey =
  | "adult"
  | "air_date"
  | "also_known_as"
  | "alternative_titles"
  | "biography"
  | "birthday"
  | "budget"
  | "cast"
  | "certifications"
  | "character_names"
  | "created_by"
  | "crew"
  | "deathday"
  | "episode"
  | "episode_number"
  | "episode_run_time"
  | "freebase_id"
  | "freebase_mid"
  | "general"
  | "genres"
  | "guest_stars"
  | "homepage"
  | "images"
  | "imdb_id"
  | "languages"
  | "name"
  | "network"
  | "origin_country"
  | "original_name"
  | "original_title"
  | "overview"
  | "parts"
  | "place_of_birth"
  | "plot_keywords"
  | "production_code"
  | "production_companies"
  | "production_countries"
  | "releases"
  | "revenue"
  | "runtime"
  | "season"
  | "season_number"
  | "season_regular"
  | "spoken_languages"
  | "status"
  | "tagline"
  | "title"
  | "translations"
  | "tvdb_id"
  | "tvrage_id"
  | "type"
  | "video"
  | "videos";

export type TMDBFilm = {
  id: number;
  title: string;
  poster_path: string;
  media_type: string;
};

export type SavedTMDBFilm = {
  id: number;
  filmID: number;
  title: string;
  poster_path: string;
  media_type: string;
};

export type TMDBConfig = {
  images: TMDBImagesConfig;
  change_keys: TMDBChangeKey[];
};

// Films

export type MediaType = "movie" | "tv";
export type Credit = {
  id: number;
  name: string;
  character?: string;
  job?: string;
  profile_path: string | null;
};

export type Credits = {
  cast: Array<Credit>;
  crew: Array<Credit>;
};

export type FilmBase = {
  id: number;

  overview: string;
  tagline: string | null;

  poster_path: string;
  backdrop_path: string;

  vote_average: number;
  vote_count: number;
  popularity: number;

  genres: Array<{
    id: number;
    name: string;
  }>;
};

export type Movie = FilmBase & {
  title: string;
  original_title: string;

  release_date: string | null;
  runtime: number | null;
  status: string;

  production_companies: Array<{
    id: number;
    name: string;
  }>;
};

export type TVShow = FilmBase & {
  name: string;
  original_name: string;

  created_by: Array<{
    id: number;
    name: string;
    original_name: string;
  }>;

  first_air_date: string | null;
  last_air_date: string | null;
  status: string;

  number_of_seasons: number;
  number_of_episodes: number;
};

export type FilmRecommendation = {
  id: number;
  name?: string;
  title?: string;
  poster_path: string;
  media_type: string;
};
