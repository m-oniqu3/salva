"use server";

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

  const { data: followerUserIDs, error: followerUserIDsError } = await supabase
    .from("follow-users")
    .select("user_id")
    .eq("target_id", targetUserID)
    .order("created_at", { ascending: false })
    .range(start, end);

  if (followerUserIDsError) {
    console.error(
      "Error fetching followers for the target user",
      followerUserIDsError
    );

    return {
      data: null,
      error:
        "Could not get followers for the target user." + followerUserIDsError,
    };
  }

  if (!followerUserIDs) {
    return { data: null, error: "No followers found for the target user." };
  }

  // IDs array
  const followerIDs = followerUserIDs.reduce((acc, cur) => {
    if (!cur.user_id) return acc;
    acc.push(cur.user_id);

    return acc;
  }, [] as Array<string>);

  // Get the profile data for all the users
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", followerIDs);

  if (profilesError) {
    console.error("Error fetching profile data", profilesError);
    return { data: null, error: "Could not find profiles." };
  }

  if (!profiles) {
    return { data: null, error: "No profiles found." };
  }

  return { data: profiles, error: null };
}
