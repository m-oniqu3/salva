"use server";

import { CollectionSummary } from "@/types/collection";
import { Result } from "@/types/result";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

type Response = Promise<Result<CollectionSummary | null>>;

export async function findCollection(username: string, slug: string): Response {
  try {
    const supabase = await createClient();

    //get the profile
    const { data: profile, error: profileError } = await getProfile({
      username,
    });

    if (profileError || !profile) {
      console.error(
        "Error fetching profile data while fetching collection",
        profileError
      );
      return {
        data: null,
        error:
          profileError ??
          "Could not get profile data while fetching collection ",
      };
    }

    const { id, avatar, username: user, user_id: userID, firstname } = profile;

    const { data, error } = await supabase
      .from("collections")
      .select("id, name, is_private, cover_image, slug, description")
      .eq("user_id", userID)
      .eq("slug", slug)
      .single();

    if (error || !data) {
      console.error("Error finding collection:", error.message);
      return {
        data: null,
        error: error ? "Failed to find collection." : "No collection found",
      };
    }

    const summary = {
      user: { id, userID, username: user, avatar, firstname },
      collection: data,
    };

    return { data: summary, error: null };
  } catch (error) {
    console.error("Unexpected error in findCollection:", error);
    return { data: null, error: "Unexpected error finding collection." };
  }
}
