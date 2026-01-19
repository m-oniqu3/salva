"use server";

import getUser from "@/server-actions/get-user";
import { Result } from "@/types/result";
import { TMDBFilm } from "@/types/tmdb";
import { createClient } from "@utils/supabase/server";

type Props = {
  film: TMDBFilm;
  addedIDs: number[]; // collection IDs to add to
  deletedIDs: number[]; // collection IDs to remove from
};

export async function addFilmToCollection(props: Props): Result<number | null> {
  const { film, addedIDs, deletedIDs } = props;

  console.log(props);

  try {
    const supabase = await createClient();
    const { data: user } = await getUser(supabase);

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: filmRow, error } = await supabase
      .from("films")
      .select("id")
      .eq("id", film.id)
      .maybeSingle();

    if (error) throw error;

    let filmID = filmRow?.id;

    if (!filmID) {
      const { data, error } = await supabase
        .from("films")
        .insert(film)
        .select("id")
        .single();

      if (error) throw error;
      filmID = data.id;
    }

    // Remove film from unselected collections
    if (deletedIDs.length > 0) {
      const { error: deleteError } = await supabase
        .from("collection_films")
        .delete()
        .eq("user_id", user.id)
        .eq("film_id", filmID)
        .in("collection_id", deletedIDs);

      if (deleteError) {
        throw new Error("Failed to remove film from collections");
      }
    }

    // Add film to selected collections
    if (addedIDs.length > 0) {
      const inserts = addedIDs.map((collectionID) => ({
        user_id: user.id,
        film_id: filmID,
        collection_id: collectionID,
      }));

      const { error: insertError } = await supabase
        .from("collection_films")
        .insert(inserts);

      if (insertError) throw insertError;
    }

    return { data: filmID, error: null };
  } catch (error) {
    console.error("Error in addFilmToCollection:", error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error while saving film.",
    };
  }
}
