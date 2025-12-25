"use server";

import { CollectionSummary } from "@/types/collection";
import { Result } from "@/types/result";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

type Response = Result<CollectionSummary | null>;

export async function findCollection(username: string, slug: string): Response {
  try {
    if (!username || !slug) {
      throw new Error("Missing identifier. Username and slug are required.");
    }

    const supabase = await createClient();

    //Get the profile
    const { data: profile, error: profileError } = await getProfile({
      username,
    });

    if (profileError) {
      throw new Error(`Error fetching profile: ${profileError}`);
    }

    if (!profile) {
      throw new Error("Profile not found");
    }

    const { id, avatar, username: user, user_id, firstname } = profile;

    const { data, error } = await supabase
      .from("collections")
      .select("id, name, is_private, cover_image, slug, description")
      .eq("user_id", user_id)
      .eq("slug", slug)
      .single();

    if (error) {
      throw new Error(`Failed to find collection: ${error.message}`);
    }

    if (!data) {
      throw new Error("Collection not found");
    }

    const summary: CollectionSummary = {
      user: { id, user_id, username: user, avatar, firstname },
      collection: data,
    };

    return { data: summary, error: null };
  } catch (error) {
    console.error(`Error in ${findCollection.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
