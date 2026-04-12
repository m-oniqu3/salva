export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",

  // TV-specific but still useful to include
  "Reality",
  "Talk",
  "News",
  "Soap",
  "Kids",

  // merged concept from TV
  "War & Politics",
] as const;

export type Genre = (typeof GENRES)[number];
