"use server";

import { CollectionCover, CollectionPreview } from "@/types/collection";
import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type GetTopCollectionsResponse = Result<Array<CollectionPreview> | null>;

export async function getTopCollections(): GetTopCollectionsResponse {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("collections_with_film_count")
      .select(
        `
    id, name, is_private, cover_image, slug, cover_type, film_count,
    user:profiles(user_id,username,avatar,firstname)
  `,
      )
      .eq("is_private", false)
      .gt("film_count", 7)
      // .gte(
      //   "created_at",
      //   new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      // )
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) throw error;

    const collections: Array<CollectionPreview> = data.map(
      ({ user, ...col }) => {
        return {
          collection: {
            ...col,
            id: col.id!,
            name: col.name!,
            slug: col.slug!,
            cover_image: col.cover_image!,
            film_count: col.film_count!,
            is_private: col.is_private!,
            cover_type: col.cover_type
              ? (col.cover_type as CollectionCover)
              : null,
          },
          user: user!,
        };
      },
    );

    return { data: collections, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
