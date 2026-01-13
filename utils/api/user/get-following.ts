"use server";

import getUser from "@/server-actions/get-user";
import { Result } from "@/types/result";
import { Follower } from "@/types/user";
import { createClient } from "@utils/supabase/server";
import { calculateRange } from "@utils/validation/paginate";

type Props = {
  targetUserID: string;
  page: number;
  limit?: number | null;
};

type Response = Result<Array<Follower> | null>;

/**
 * Find the followers of the target user.
 * Who is the target user following?
 *
 * followers → people who follow you
 * following → people you follow
 */
export async function getFollowing(props: Props): Response {
  const { targetUserID, page, limit } = props;

  try {
    if (!targetUserID) {
      throw new Error(
        `Missing identifier. TargetUserID is missing or null in ${getFollowing.name}`
      );
    }

    const [start, end] = calculateRange(page, limit ?? 10);
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
      throw new Error(
        `Error fetching target user's following: ${targetFollowing.error.message}`
      );
    }

    if (userFollowing?.error) {
      throw new Error(
        `Error fetching user's following: ${userFollowing.error.message}`
      );
    }

    if (!targetFollowing.data) {
      return { data: null, error: null };
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

    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      return { data: null, error: null };
    }

    // Follower information for the target user's following
    const followings: Array<Follower> = profiles.map((p) => {
      return {
        id: p.user_id,
        isFollowedByViewer: userFollowingIDs.has(p.user_id),
        profile: p,
      };
    });

    // If auth user, if the target user follows them , pin them to the top of the followings array
    if (user) pinUserToTop(followings, user.id);

    return { data: followings, error: null };
  } catch (error) {
    console.error(`Error in ${getFollowing.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

// Shift the auth user to the top of the array
function pinUserToTop(followers: Array<Follower>, userID: string): void {
  const index = followers.findIndex((follower) => follower.id === userID);

  if (index > -1) {
    const [authUser] = followers.splice(index, 1);
    followers.unshift(authUser);
  }
}
