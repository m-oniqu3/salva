"use server";

import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  filmIDs: number[];
  collectionIDs: number[];
};

export async function massCopyFilms(props: Props) {
  try {
    const { filmIDs, collectionIDs } = props;

    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!auth.user) return { data: null, error: null };

    // Build all inserts
    const inserts = collectionIDs.flatMap((colID) => {
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
