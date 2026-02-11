"use server";

import { CollectionSummary } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

type Response = Result<CollectionSummary | null>;

// Find the collection belonging to the given user
export async function findCollection(username: string, slug: string): Response {
  try {
    const supabase = await createClient();

    // Get the collection,its film count its owner
    const { data, error } = await supabase
      .from("collections")
      .select(
        `id, name, is_private, cover_image, slug, description,
         user:profiles(id, avatar, username, user_id, firstname, lastname),
         films:collection_films(id)
        `,
      )
      .eq("user.username", username)
      .eq("slug", slug)
      .single();

    if (error) throw error;

    if (!data) {
      return { data: null, error: null };
    }

    const summary: CollectionSummary = {
      user: data.user,
      collection: { ...data, filmCount: data.films.length },
    };

    return { data: summary, error: null };
  } catch (error) {
    console.error(`Error in ${findCollection.name}:`, error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching the collection.",
    };
  }
}
