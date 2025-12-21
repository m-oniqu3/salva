"use server";

import getUser from "@/server-actions/get-user";
import { Result } from "@/types/result";
import { Follower } from "@/types/user";
import { createClient } from "@utils/supabase/server";
import { calculateRange } from "@utils/validation/paginate";

type Response = Result<Array<Follower> | null>;

type Props = {
  targetUserID: string;
  page: number;
  limit?: number | null;
};

/**
 *
 * Get followers for the giver user (target user).
 * Find out if the user (auth user) is following any of the given user's (target user) followers.
 * Who follows the target user?
 *
 * followers → people who follow you
 * following → people you follow
 */
export async function getFollowers(props: Props): Response {
  const { targetUserID, page, limit } = props;

  if (!targetUserID)
    return {
      data: null,
      error:
        "Missing identifier. TargetUserID is missing or null." +
        "Function " +
        getFollowers.name,
    };

  const supabase = await createClient();
  const [start, end] = calculateRange(page, limit ?? 10);

  // Get IDs for followers of the target user
  const targetUserFollowers = supabase
    .from("follow_users")
    .select("user_id")
    .eq("target_id", targetUserID)
    .order("created_at", { ascending: false })
    .range(start, end);

  const { data: user } = await getUser(supabase);

  // Get users that the auth user is following
  const userFollowingQuery = user
    ? supabase.from("follow_users").select("target_id").eq("user_id", user.id)
    : null;

  const [targetFollowers, userFollowing] = await Promise.all([
    targetUserFollowers,
    userFollowingQuery,
  ]);

  if (targetFollowers.error) {
    console.error(
      "Error fetching followers for the target user",
      targetFollowers.error
    );

    return {
      data: null,
      error:
        "Could not get followers for the target user." + targetFollowers.error,
    };
  }

  if (userFollowing?.error) {
    console.error("Error fetching followers for user", userFollowing?.error);

    return {
      data: null,
      error: "Could not get followers for user." + userFollowing?.error,
    };
  }

  if (!targetFollowers.data) {
    return {
      data: null,
      error: "No results found for the target user's followers.",
    };
  }

  // User IDs that the auth user is following
  const usersFollowersIDs = new Set(
    userFollowing?.data.map((user) => user.target_id) ?? []
  );

  const targetFollowersIDs = targetFollowers.data.map((t) => t.user_id);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, user_id, avatar, username, firstname, lastname")
    .in("user_id", targetFollowersIDs);

  if (!profiles || profilesError) {
    return {
      data: null,
      error:
        "No profiles found. Could not get profiles for target user's followings.",
    };
  }

  // Follower information for the target user
  const followers = profiles.map((p) => {
    return {
      id: p.user_id,
      isFollowedByViewer: usersFollowersIDs.has(p.user_id),
      profile: p,
    };
  });

  if (user) pinUserToTop(followers, user.id);

  return { data: followers, error: null };
}

// Shift the auth user to the top of the array
function pinUserToTop(followers: Array<Follower>, userID: string) {
  const index = followers.findIndex((follower) => follower.id === userID);

  if (index > -1) {
    const [authUser] = followers.splice(index, 1);
    followers.unshift(authUser);
  }
}
