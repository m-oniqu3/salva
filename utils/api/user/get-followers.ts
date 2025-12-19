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
 * Get followers for the giver user (target user)
 * Find out if the user (auth user) is following any of the given user's followers
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

  const { data: user } = await getUser(supabase);

  // Get IDs for followers of the target user
  const followersForTargetUserQuery = supabase
    .from("follow-users")
    .select("user_id")
    .eq("target_id", targetUserID)
    .order("created_at", { ascending: false })
    .range(start, end);

  // Get all the people that the logged in user is following
  const followersForUserQuery = user
    ? supabase.from("follow-users").select("user_id").eq("user_id", user.id)
    : null;

  const [targetUserResponse, userResponse] = await Promise.all([
    followersForTargetUserQuery,
    followersForUserQuery,
  ]);

  // const { data: followerIDsForUser, error: followerIDsForUserError } =
  //   userResponse ?? { data: null, error: null };

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

  const followerIDs = targetUserResponse.data.map((user) => user.user_id);

  // Get the profile data for all the target user's followers
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, user_id, avatar, username, firstname, lastname ")
    .in("user_id", followerIDs);

  if (profilesError) {
    console.error("Error fetching profile data", profilesError);
    return { data: null, error: "Could not find profiles." };
  }

  if (!profiles) {
    return { data: null, error: "No profiles found." };
  }

  // Follower IDs for the auth user's followers
  const followerIDsFromUser = new Set(
    userResponse && userResponse.data.map((user) => user.user_id)
  );

  console.log(followerIDsFromUser);

  const profileByUserId = new Map(profiles.map((p) => [p.user_id, p]));

  // Follower IDs for the target user - array
  const followers = followerIDs.map((id) => {
    return {
      id,
      isUserFollowing: followerIDsFromUser.has(id),
      profile: profileByUserId.get(id) ?? null,
    };
  });

  return { data: followers, error: null };
}
