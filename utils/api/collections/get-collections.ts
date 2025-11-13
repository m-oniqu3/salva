import { CollectionPreview } from "@/types/collection";
import { Result } from "@/types/result";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

type Response = Promise<Result<Array<CollectionPreview> | null>>;

/**
 *
 * @param username string
 * @returns Response
 * @description gets the collections for a user
 */
export async function getCollections(username: string): Response {
  try {
    const supabase = await createClient();

    //get the profile
    const { data: profile, error: profileError } = await getProfile(username);

    //handle !user case separately
    if (profileError || !profile) {
      console.error(
        "Error getting profile while fetching collections:",
        profileError
      );
      return { data: null, error: profileError ?? "No profile found." };
    }

    const { data: collections, error } = await supabase
      .from("collections")
      .select("id, name, is_private, cover_image, slug")
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching collections:", error.message);
      return { data: null, error: "Failed to fetch collections." };
    }

    return {
      data: collections,
      error: null,
    };
  } catch (err) {
    console.error("Unexpected error in getCollections:", err);
    return { data: null, error: "Unexpected error fetching collections." };
  }
}
