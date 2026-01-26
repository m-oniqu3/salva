"use server";

import { CollectionMeta } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

type Response = Result<CollectionMeta[] | null>;

export async function getFilmCollections(filmID: number): Response {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error("Not authenticated");
    }

    // Get the collections the film is saved in
    const { data, error } = await supabase
      .from("collection_films")
      .select(
        `
         collection_id,
            collections(
            id,
            name,
            is_private,
            cover_image,
            collection_films(count)
            )
        `,
      )
      .eq("user_id", auth.user.id)
      .eq("film_id", filmID)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!data) {
      return { data: null, error: null };
    }

    const collections = data.map((collection) => {
      return {
        ...collection.collections,
        films_count: collection.collections.collection_films[0]?.count ?? 0,
      };
    });

    return { data: collections, error: null };
  } catch (error) {
    console.error(`Error in ${getFilmCollections.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred when trying to get collections the film is saved to..",
    };
  }
}
