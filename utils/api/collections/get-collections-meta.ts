"use server";

import { CollectionMeta } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

type Response = Result<CollectionMeta[] | null>;

/**
 *
 * Fetches all user collections
 * Fetches which collections already contain this film
 * Reorders collections so: “Saved in” collections appear first & Everything else follows
 *
 */
export async function getCollectionsMeta(filmID: number): Response {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error("Not authenticated");
    }

    // get the collections the film is saved in
    // const { data: collectionsSavedTo, error: collectionsSavedToError } =
    //   await supabase
    //     .from("collection_films")
    //     .select("collection_id")
    //     .eq("user_id", auth.user.id)
    //     .eq("film_id", filmID)
    //     .order("created_at", { ascending: false });

    // if (collectionsSavedToError) throw collectionsSavedToError;

    // const savedIDs = collectionsSavedTo?.map((col) => col.collection_id) ?? [];

    // const inFilter = `(${savedIDs.join(",")})`;

    //Gets meta of the user's collections
    // and how much films they have saved to them
    const { data: collections, error: collectionsError } = await supabase
      .from("collections")
      .select(
        `
          id, 
          name, 
          is_private, 
          cover_image,
          collection_films(id)
        `,
      )
      .eq("user_id", auth.user.id)
      // .not("id", "in", inFilter)
      .order("created_at", { ascending: false });

    if (collectionsError) throw collectionsError;

    if (!collections) {
      return { data: null, error: null };
    }

    const collections_meta = collections.map((collection) => {
      return {
        ...collection,
        films_count: collection.collection_films.length,
      };
    });

    return { data: collections_meta, error: null };
  } catch (error) {
    console.error(`Error in ${getCollectionsMeta.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred when trying to get collections meta.",
    };
  }
}
