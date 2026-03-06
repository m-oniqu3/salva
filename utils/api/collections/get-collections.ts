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
      .from("collections")
      .select(
        `id, name, is_private, cover_image, slug, cover_type,
         films:collection_films(id),
         user:profiles(user_id,username)
        `,
      )
      .eq("user_id", targetUserID)
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) throw error;

    const collections: Array<CollectionPreview> = data.map(
      ({ films, user, ...col }) => {
        return {
          collection: {
            ...col,
            cover_type: col.cover_type
              ? (col.cover_type as CollectionCover)
              : null,
            film_count: films.length,
          },
          user,
        };
      },
    );

    return { data: collections, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
