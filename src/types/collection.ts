export type Collection = {
  id: number;
  user_id: string;
  name: string;
  description: string;
  cover_image: string | null;
  is_private: boolean;
  created_at: string; // ISO date string
};

export type CollectionPreview = {
  id: number;
  name: string;
  is_private: boolean;
  cover_image: string | null;
  slug: string;
  film_count: number;
};

export type CollectionSummary = {
  user: {
    id: number;
    user_id: string;
    username: string;
    avatar: string | null;
    firstname: string;
    lastname: string;
  };

  collection: {
    id: number;
    name: string;
    is_private: boolean;
    cover_image: string | null;
    slug: string | null;
    description: string;
    film_count: number;
  };
};

export type MostRecentCollection = {
  id: number;
  name: string;
};

export type CollectionMeta = {
  id: number;
  name: string;
  is_private: boolean;
  cover_image: string | null;
  films_count: number;
};
