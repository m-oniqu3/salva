export type Collection = {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  is_private: boolean;
  created_at: string; // ISO date string
};

export type CollectionPreview = {
  id: number;
  name: string;
  is_private: boolean;
  cover_image: string | null;
};

export type CollectionSummary = {
  user: {
    id: number;
    userID: string;
    username: string;
    avatar: string | null;
  };

  collection: {
    id: number;
    name: string;
    is_private: boolean;
    cover_image: string | null;
  };
};
