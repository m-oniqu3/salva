"use server";

import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props =
  | {
      action: "copy";
      filmIDs: number[];
      targetCollectionIDs: number[];
    }
  | {
      action: "move";
      sourceCollectionID: number;
      cf_ids: number[];
      filmIDs: number[];
      targetCollectionIDs: number[];
    };

export async function transferFilms(props: Props) {
  try {
    const { action, filmIDs, targetCollectionIDs } = props;

    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!auth.user) return { data: null, error: null };

    // Delete the films first
    if (action === "move") {
      const { cf_ids, sourceCollectionID } = props;

      const { error } = await supabase
        .from("collection_films")
        .delete()
        .eq("user_id", auth.user.id)
        .in("id", cf_ids)
        .eq("collection_id", sourceCollectionID);

      if (error) throw error;
    }

    // Build all inserts
    const inserts = targetCollectionIDs.flatMap((colID) => {
      return filmIDs.map((filmID) => {
        return { user_id: auth.user.id, film_id: filmID, collection_id: colID };
      });
    });

    // Single insert for all combinations
    const { data, error } = await supabase
      .from("collection_films")
      .insert(inserts);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
