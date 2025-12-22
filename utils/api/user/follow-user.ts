"use server";

import getUser from "@/server-actions/get-user";
import { Result } from "@/types/result";
import { UserFollow } from "@/types/user";
import { createClient } from "@utils/supabase/server";

type Response = Result<UserFollow | null>;

/**
 *
  Toggles follow status for a target user
 * @param targetUserID - The ID of the user to follow/unfollow
 * @returns UserFollow data on follow, null on unfollow
 */

export async function toggleFollowUser(targetUserID: string): Response {
  try {
    const supabase = await createClient();
    const { data: user } = await getUser(supabase);

    // Is there a current user? (Are they logged in?)
    if (!user) {
      throw new Error(
        "Could not toggle follow. No user exists. Please log in."
      );
    }

    if (user.id === targetUserID) {
      throw new Error("User cannot follow themselves");
    }

    // Is the target user is already being followed by the current user?
    const { data: followed, error: followedErr } = await supabase
      .from("follow_users")
      .select("*")
      .eq("user_id", user.id)
      .eq("target_id", targetUserID)
      .maybeSingle();

    if (followedErr) {
      throw new Error(
        `Error checking if target user is being followed: ${followedErr.message}`
      );
    }

    // If target user is already being followed , unfollow the target user.
    if (followed) {
      const { error } = await supabase
        .from("follow_users")
        .delete()
        .eq("user_id", user.id)
        .eq("target_id", targetUserID);

      if (error) {
        throw new Error(`Error unfollowing target user: ${error.message}`);
      }

      console.log("Successfully un-followed user.", toggleFollowUser.name);
      return { data: null, error: null };
    }

    // Follow the target user.
    const { data: follow, error: followErr } = await supabase
      .from("follow_users")
      .insert([{ user_id: user.id, target_id: targetUserID }])
      .select()
      .single();

    if (followErr) {
      throw new Error(`Error following target user: ${followErr.message}`);
    }

    console.log("Successfully followed user.", toggleFollowUser.name);
    return { data: follow, error: null };
  } catch (error) {
    console.error(`Error in ${toggleFollowUser.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
