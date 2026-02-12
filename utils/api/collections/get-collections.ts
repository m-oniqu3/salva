"use server";

import { CollectionPreview } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";
import { calculateRange } from "@utils/validation/paginate";

type GetCollectionsResponse = Result<Array<CollectionPreview> | null>;

type Props = {
  username: string;
  page: number;
};

// Gets the collections for the given user
export async function getCollections(props: Props): GetCollectionsResponse {
  try {
    const { username, page } = props;
    const [start, end] = calculateRange(page, 10);

    const supabase = await createClient();

    // Get the user from the username
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", username)
      .single();

    if (profileErr) throw profileErr;

    if (!profile) {
      return { data: null, error: null };
    }

    const { data, error } = await supabase
      .from("collections")
      .select(
        `id, name, is_private, cover_image, slug,
         films:collection_films(id)
        `,
      )
      .eq("user_id", profile.user_id)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;

    const collections: Array<CollectionPreview> = data.map((col) => {
      return {
        ...col,
        film_count: col.films.length,
      };
    });

    return { data: collections, error: null };
  } catch (error) {
    console.error("Unexpected error in getCollections:", error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching the collection.",
    };
  }
}
