"use server";

import getUser from "@/server-actions/get-user";
import { Result } from "@/types/result";
import { UserFollow } from "@/types/user";
import { createClient } from "@utils/supabase/server";

type Response = Result<UserFollow | null>;

/**
 *
 * @param targetUserID string
 * @description
 *
 * @returns UserFollow | null
 */
export async function toggleFollowUser(targetUserID: string): Response {
  const supabase = await createClient();
  const { data: user } = await getUser(supabase);

  // Is there a current user? (Are they logged in?)
  if (!user) {
    return {
      data: null,
      error: "Could not toggle follow. No user exists. Please log in.",
    };
  }

  // Is the target user is already being followed by the current user?
  const { data: followed, error: followedErr } = await supabase
    .from("follow-users")
    .select("*")
    .eq("user_id", user.id)
    .eq("target_id", targetUserID)
    .maybeSingle();

  if (followedErr) {
    console.error(
      "Error checking if target user is being followed.",
      followedErr
    );

    return {
      data: null,
      error: "Could not check if target user is being followed." + followedErr,
    };
  }

  // If target user is already being followed , unfollow the target user.
  if (followed) {
    const { error } = await supabase
      .from("follow-users")
      .delete()
      .eq("user_id", user.id)
      .eq("target_id", targetUserID);

    if (error) {
      console.error(
        "Error unfollowing the target user. Could not delete follow.",
        error
      );

      return {
        data: null,
        error: "Could not unfollow target user." + error,
      };
    }

    console.log("Successfully un-followed user.", toggleFollowUser.name);
    //Should I return sucess message here?
    return { data: null, error: null };
  }

  // Follow the target user.
  const { data: follow, error: followErr } = await supabase
    .from("follow-users")
    .insert([{ user_id: user.id, target_id: targetUserID }])
    .select()
    .single();

  if (followErr) {
    console.error("Error deleting follow for target user", followErr);

    return {
      data: null,
      error: "Could not unfollow target user." + followErr,
    };
  }

  // Revalidate profile page cache
  // revalidatePath("/[profile]", "page");

  console.log("Successfully followed user.", toggleFollowUser.name);
  return { data: follow, error: null };
}
