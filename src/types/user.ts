export type Profile = {
  id: number;
  user_id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  bio: string | null;
  created_at: string;
};

export type UserFollow = {
  id: number;
  user_id: string;
  target_id: string;
  created_at: string;
};

export type UserFollowings = {
  followers: number;
  following: number;
  isFollowing: boolean;
};
