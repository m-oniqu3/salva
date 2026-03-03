"use server";

import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  savedIDs: number[];
  collectionID: number;
};

export async function massDeleteFilms(props: Props) {
  const { savedIDs, collectionID } = props;

  try {
    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError) throw authError;
    if (!auth.user) return { data: null, error: null };

    // Delete all combinations in one query
    const { data, error } = await supabase
      .from("collection_films")
      .delete()
      .eq("user_id", auth.user.id)
      .in("id", savedIDs)
      .eq("collection_id", collectionID);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
