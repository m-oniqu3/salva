"use server";

import { CollectionCover, CollectionPreview } from "@/types/collection";
import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";
import { calculateRange } from "@utils/validation/paginate";

type GetCollectionsResponse = Result<Array<CollectionPreview> | null>;

type Props = {
  targetUserID: string;
  page: number;
};

// Gets the collections for the given user
export async function getCollections(props: Props): GetCollectionsResponse {
  try {
    const { targetUserID, page } = props;
    const [start, end] = calculateRange(page, 10);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("collections_with_film_count")
      .select(
        ` id, name, is_private, cover_image, slug, cover_type, film_count, created_at,
         user:profiles(user_id,username)
        `,
      )
      .eq("user_id", targetUserID)
      .order("created_at", { ascending: false })
      .range(start, end);

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
            created_at: col.created_at!,
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
