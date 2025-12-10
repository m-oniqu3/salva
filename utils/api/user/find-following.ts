"use server";

import { Result } from "@/types/result";
import { UserFollowings } from "@/types/user";
import { createClient } from "@utils/supabase/server";

type Response = Promise<Result<UserFollowings | null>>;

//target user should come from the profile
export async function getIsFollowing(
  userID: string | null,
  targetUserID: string
): Response {
  const supabase = await createClient();

  // Get the follower count.
  // How many people/users follow the target user?
  const targetFollowerCountQuery = supabase
    .from("follow-users")
    .select("*", { count: "exact", head: true })
    .eq("target_id", targetUserID);

  // Get the following count.
  // How many people/users is the target user following?
  const targetFollowingCountQuery = supabase
    .from("follow-users")
    .select("*", { count: "exact", head: true })
    .eq("user_id", targetUserID);

  // Is the current user following them (the target) or not?
  // Is the target being followed by the current user or not?
  const userIsFollowingQuery = userID
    ? supabase
        .from("follow-users")
        .select("*")
        .eq("user_id", userID)
        .eq("target_id", targetUserID)
        .maybeSingle()
    : null;

  const [followerResponse, followingResponse, isFollowingResponse] =
    await Promise.all([
      targetFollowerCountQuery,
      targetFollowingCountQuery,
      userIsFollowingQuery,
    ]);

  // Destructure each query result
  const {  count: followerCount, error: followerError } = followerResponse;
  const { count: followingCount, error: followingError } = followingResponse;

  // isFollowingCheck may be null if user isn't logged in
  const { data: isFollowingData, error: isFollowingError } =
    isFollowingResponse ?? { data: null, error: null };

  // todo: fix error messages to match follow-user.ts errors
  if (followerError) {
    console.error("Error fetching follower count:", followerError);
    return {
      data: null,
      error: "Failed to load follower count." + followerError,
    };
  }

  if (followingError) {
    console.error("Error fetching following count:", followingError);
    return {
      data: null,
      error: "Failed to load following count." + followingError,
    };
  }

  if (isFollowingError) {
    console.error("Error checking follow status:", isFollowingError);
    return {
      data: null,
      error: "Failed to load follow status." + isFollowingError,
    };
  }

  const followers = followerCount ?? 0;
  const following = followingCount ?? 0;
  const isFollowing = Boolean(isFollowingData);

  return {
    data: { followers, following, isFollowing },
    error: null,
  };
}
