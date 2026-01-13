"use server";

import { Result } from "@/types/result";
import { UserFollowingsCount } from "@/types/user";
import { createClient } from "@utils/supabase/server";

type Response = Result<UserFollowingsCount | null>;

//target user should come from the profile
export async function getFollowingCount(
  userID: string | null,
  targetUserID: string | null
): Response {
  try {
    if (!targetUserID) {
      throw new Error(
        `Missing identifier. TargetUserID is required in ${getFollowingCount.name}`
      );
    }

    const supabase = await createClient();

    // Get the follower count.
    // How many people/users follow the target user?
    const targetFollowerCountQuery = supabase
      .from("follow_users")
      .select("*", { count: "exact", head: true })
      .eq("target_id", targetUserID);

    // Get the following count.
    // How many people/users is the target user following?
    const targetFollowingCountQuery = supabase
      .from("follow_users")
      .select("*", { count: "exact", head: true })
      .eq("user_id", targetUserID);

    // Is the current user following them (the target) or not?
    // Is the target being followed by the current user or not?
    const userIsFollowingQuery = userID
      ? supabase
          .from("follow_users")
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
    const { count: followerCount, error: followerError } = followerResponse;
    const { count: followingCount, error: followingError } = followingResponse;

    // isFollowingCheck may be null if user isn't logged in
    const { data: isFollowingData, error: isFollowingError } =
      isFollowingResponse ?? { data: null, error: null };

    if (followerError) {
      throw new Error(
        `Failed to load follower count: ${followerError.message}`
      );
    }

    if (followingError) {
      throw new Error(
        `Failed to load following count: ${followingError.message}`
      );
    }

    if (isFollowingError) {
      throw new Error(
        `Failed to load follow status: ${isFollowingError.message}`
      );
    }

    const followers = followerCount ?? 0;
    const following = followingCount ?? 0;
    const isFollowing = Boolean(isFollowingData);

    return {
      data: { followers, following, isFollowing },
      error: null,
    };
  } catch (error) {
    console.error(`Error in ${getFollowingCount.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
