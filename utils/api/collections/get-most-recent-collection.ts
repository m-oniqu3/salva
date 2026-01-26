"use server";

import { MostRecentCollection } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

type Response = Result<MostRecentCollection | null>;

/**
 *
 * @param userID string
 * @returns CollectionMeta | null
 * @description Gets the collection meta for the collection the user last saved a film to.
 */
export async function getMostRecentCollection(): Response {
  try {
    const supabase = await createClient();
    const auth = await supabase.auth.getUser();

    if (!auth.data.user) {
      throw new Error("No user present ");
    }

    const { data, error } = await supabase
      .from("collection_films")
      .select(
        ` id,
          collection:collections!inner(
              id, 
              name
          )
        `,
      )
      .eq("user_id", auth.data.user.id)
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
    console.error(
      "Unexpected error in " + getMostRecentCollection.name + ": ",
      error,
    );

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch most recent collection",
    };
  }
}
