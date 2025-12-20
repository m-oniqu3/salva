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
 * Find the followers of the target user.
 * Who is the target user following?
 *
 * followers → people who follow you
 * following → people you follow
 */
export async function getFollowing(props: Props): Response {
  const { targetUserID, page, limit } = props;
  const [start, end] = calculateRange(page, limit ?? 10);

  if (!targetUserID) {
    return {
      data: null,
      error:
        "Missing identifier. TargetUserID is missing or null." +
        "Function " +
        getFollowing.name,
    };
  }

  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  // Get target user's following
  // Get the users that the target user is following
  const targetUserFollowing = supabase
    .from("follow_users")
    .select("target_id")
    .eq("user_id", targetUserID)
    .order("created_at", { ascending: false })
    .range(start, end);

  // Get auth user's following
  // Fetch the users that the auth user is following
  const userFollowingQuery = user
    ? supabase.from("follow_users").select("target_id").eq("user_id", user.id)
    : null;

  const [targetFollowing, userFollowing] = await Promise.all([
    targetUserFollowing,
    userFollowingQuery,
  ]);

  if (targetFollowing.error) {
    console.error(
      "Error fetching target user's following.",
      targetFollowing.error
    );

    return {
      data: null,
      error:
        "Could not get the target user's following." + targetFollowing.error,
    };
  }

  if (userFollowing?.error) {
    console.error("Error fetching user's following", userFollowing?.error);

    return {
      data: null,
      error: "Could not get user's follwoing." + userFollowing?.error,
    };
  }

  if (!targetFollowing.data) {
    return {
      data: null,
      error: "No results found for the target user's following.",
    };
  }

  // IDs of users from the auth user's following
  const userFollowingIDs = new Set(
    userFollowing?.data.map((user) => user.target_id) ?? []
  );

  const targetFollowingIDs = targetFollowing.data.map((t) => t.target_id);

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, user_id, avatar, username, firstname, lastname")
    .in("user_id", targetFollowingIDs);

  if (!profiles || profilesError) {
    return {
      data: null,
      error:
        "No profiles found. Could not get profiles for target user's followings.",
    };
  }

  const profileByUserID = new Map(profiles.map((p) => [p.user_id, p]));

  // Follower information for the target user's following
  const followings = targetFollowing.data.map((user) => {
    return {
      id: user.target_id,
      isFollowedByViewer: userFollowingIDs.has(user.target_id),
      profile: profileByUserID.get(user.target_id)!,
    };
  });

  // If auth user, if the target user follows them , pin them to the top of the followings array
  if (user) pinUserToTop(followings, user.id);

  return { data: followings, error: null };
}

// Shift the auth user to the top of the array
function pinUserToTop(followers: Array<Follower>, userID: string) {
  const index = followers.findIndex((follower) => follower.id === userID);

  if (index > -1) {
    const [authUser] = followers.splice(index, 1);
    followers.unshift(authUser);
  }
}
