export type Collection = {
  id: number;
  user_id: string;
  name: string;
  description: string;
  cover_image: string | null;
  cover_type: CollectionCover | null;
  is_private: boolean;
  created_at: string; // ISO date string
};

export type CollectionPreview = {
  collection: {
    id: number;
    name: string;
    is_private: boolean;
    cover_image: string | null;
    cover_type: CollectionCover | null;
    slug: string;
    film_count: number;
  };
  user: { user_id: string; username: string };
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
    cover_type: CollectionCover | null;
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
  cover_type: CollectionCover | null;
  films_count: number;
};

export type EditCollectionDetals = {
  id: number;
  name: string;
  description: string | null;
  cover_image: string | null;
  cover_type: CollectionCover | null;
  collection_owner_id: string;
};

export type CollectionCover = "uploaded" | "external";
