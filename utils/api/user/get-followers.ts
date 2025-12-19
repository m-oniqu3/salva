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
  const followersForTargetUserQuery = supabase
    .from("follow_users")
    .select(
      ` user_id,
        profiles!user_id(
        id,
        user_id,
        avatar,
        username,
        firstname,
        lastname 
        )
      `
    )
    .eq("target_id", targetUserID)
    .order("created_at", { ascending: false })
    .range(start, end);

  const { data: user } = await getUser(supabase);

  // Get users that the auth user is following
  const followersForUserQuery = user
    ? supabase.from("follow_users").select("target_id").eq("user_id", user.id)
    : null;

  const [targetUserResponse, userResponse] = await Promise.all([
    followersForTargetUserQuery,
    followersForUserQuery,
  ]);

  if (targetUserResponse.error) {
    console.error(
      "Error fetching followers for the target user",
      targetUserResponse.error
    );

    return {
      data: null,
      error:
        "Could not get followers for the target user." +
        targetUserResponse.error,
    };
  }

  if (userResponse?.error) {
    console.error("Error fetching followers for user", userResponse?.error);

    return {
      data: null,
      error: "Could not get followers for user." + userResponse?.error,
    };
  }

  if (!targetUserResponse.data) {
    return { data: null, error: "No followers found for the target user." };
  }

  // User IDs that the auth user is following
  const usersFollowersIDs = new Set(
    userResponse?.data.map((user) => user.target_id) ?? []
  );

  // Follower information for the target user
  const followers = targetUserResponse.data.map((user) => {
    return {
      id: user.user_id,
      isFollowedByViewer: usersFollowersIDs.has(user.user_id),
      profile: user.profiles,
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
