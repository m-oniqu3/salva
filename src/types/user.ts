export type Profile = {
  id: number;
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  avatar: string;
  bio: string;
  created_at: string;
};

export type ProfileSnippet = {
  id: number;
  user_id: string;
  username: string;
  firstname: string;
  lastname: string;
  avatar: string;
};

export type UserFollow = {
  id: number;
  user_id: string;
  target_id: string;
  created_at: string;
};

export type UserFollowingsCount = {
  followers: number;
  following: number;
  isFollowing: boolean;
};

export type Follower = {
  id: string;
  profile: {
    id: number;
    user_id: string;
    avatar: string;
    username: string;
    firstname: string;
    lastname: string;
  };
  isFollowedByViewer: boolean;
};

export type UserMeta = {
  userID: string;
  username: string;
} | null;
