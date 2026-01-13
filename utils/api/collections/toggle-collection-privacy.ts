"use server";

import getUser from "@/server-actions/get-user";
import { Collection } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggles a collection's privacy status (public ↔ private).
 *
 * - Validates the collection ID
 * - Ensures the user is authenticated
 * - Verifies the collection belongs to the user
 * - Flips the `is_private` flag for the collection
 *
 * Returns the updated collection or an error.
 */

async function toggleCollectionPrivacy(
  collectionID: number
): Result<Collection | null> {
  try {
    if (!collectionID) {
      throw new Error(
        "Collection ID is required to update the collection's privacy status."
      );
    }

    const supabase = await createClient();
    const { data: user, error: userError } = await getUser(supabase);

    if (userError) {
      throw new Error("Could not get user.");
    }

    if (!user) throw new Error("No user found. Please log in.");

    //Check if the user has a collection with the given ID and get back the collection info
    const { data: collection, error: collectionError } = await supabase
      .from("collections")
      .select("id,is_private")
      .eq("id", collectionID)
      .eq("user_id", user.id)
      .single();

    if (collectionError || !collection) {
      throw new Error("No collection found or access denied.");
    }

    //Flip the collection privacy status
    const { data, error } = await supabase
      .from("collections")
      .update({ is_private: !collection.is_private })
      .eq("id", collection.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !data) {
      throw new Error("Could not update the collection's privacy status.");
    }

    revalidatePath("/[profile]/[collection]", "page");
    return { data, error: null };
  } catch (error) {
    console.error(`Error in ${toggleCollectionPrivacy.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}

export default toggleCollectionPrivacy;
