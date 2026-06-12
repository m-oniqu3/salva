"use server";

import { CollectionCover, CollectionPreview } from "@/types/collection";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  range: [number, number];
  query: string;
};

export async function findCollections(props: Props) {
  try {
    const { range, query } = props;
    const [page, end] = range;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("collections_with_film_count")
      .select(
        `
            id,
            name,
            is_private,
            cover_image,
            slug,
            cover_type,
            film_count,
            created_at,
            user:profiles(user_id, username, avatar, firstname)
  `,
      )
      .eq("is_private", false)
      .ilike("name", `%${query}%`)
      .order("created_at", { ascending: false })
      .range(page, end);

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
