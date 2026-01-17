"use server";

import { CollectionSnippet } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";

type Props = {
  userID: string;
};

type Response = Result<CollectionSnippet[] | null>;

export async function getCollectionsMeta(props: Props): Response {
  const { userID } = props;
  try {
    const supabase = await createClient();

    //Gets meta of the user's collections
    // and how much films they have saved to them
    const { data: collections, error: collectionsError } = await supabase
      .from("collections")
      .select(
        `id, name, is_private, cover_image,
        collection_films(id)
            `
      )
      .eq("user_id", userID)
      .order("created_at", { ascending: false });

    if (collectionsError) throw collectionsError;

    if (!collections) {
      return { data: null, error: null };
    }

    // collections the user recently saved to
    const { data: recentCollections, error: recentCollectionsError } =
      await supabase
        .from("collection_films")
        .select("collection_id")
        .eq("user_id", userID)
        .order("created_at", { ascending: false });

    if (recentCollectionsError) throw recentCollectionsError;

    const recentCollectionsIDs = new Set(
      recentCollections.map((c) => c.collection_id)
    );

    const collectionsMap = collections.reduce((acc, cur) => {
      if (!acc[cur.id]) {
        acc[cur.id] = {
          ...cur,
          filmCount: cur.collection_films.length,
        };
      }

      return acc;
    }, {} as Record<number, CollectionSnippet>);
    const orderedCollections: CollectionSnippet[] = [];

    // Add recently used first
    for (const id of recentCollectionsIDs) {
      if (collectionsMap[id]) {
        orderedCollections.push(collectionsMap[id]);
        delete collectionsMap[id];
      }
    }

    // Add remaining collections
    orderedCollections.push(...Object.values(collectionsMap));

    return { data: orderedCollections, error: null };
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
