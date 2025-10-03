export type Collection = {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  is_private: boolean;
  created_at: string; // ISO date string
};
