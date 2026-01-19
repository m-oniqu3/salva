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

export type TMDBConfig = {
  images: TMDBImagesConfig;
  change_keys: TMDBChangeKey[];
};
