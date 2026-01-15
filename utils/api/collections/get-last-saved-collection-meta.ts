import { CollectionMeta } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

type Response = Result<CollectionMeta | null>;

/**
 *
 * @param userID string
 * @returns CollectionMeta | null
 * @description Gets the collection meta for the collection the user last saved a film to.
 */
export async function getLastSavedCollectionMeta(userID: string): Response {
  if (!userID) {
    return { data: null, error: "User ID is required" };
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("collection_films")
      .select(
        `
            collection:collections!inner(
                id, 
                user_id, 
                name
            )
        `
      )
      .eq("collection.user_id", userID)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return { data: null, error: null };
    }

    const collection = { id: data.collection.id, name: data.collection.name };

    return { data: collection, error: null };
  } catch (error) {
    console.error("Unexpected error in getLastSavedCollectionMeta:", error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch last saved collection",
    };
  }
}
