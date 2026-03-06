"use server";

import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

/**
 * Toggles a collection's privacy status (public ↔ private).
 *
 * - Validates the collection ID
 * - Ensures the user is authenticated
 * - Verifies the collection belongs to the user
 * - Flips the `is_private` flag for the collection
 *
 * Returns the updated collection or an error.
 */

type Props = {
  collection: { id: number; isPrivate: boolean };
};

async function toggleCollectionPrivacy(props: Props): Result<null> {
  try {
    const { id, isPrivate } = props.collection;

    const supabase = await createClient();

    const { data: auth, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!auth) throw new Error("No user found. Please log in.");

    //Flip the collection privacy status
    const { error } = await supabase
      .from("collections")
      .update({ is_private: !isPrivate })
      .eq("id", id)
      .eq("user_id", auth.user.id)
      .select()
      .single();

    if (error) throw error;

    return { data: null, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}

export default toggleCollectionPrivacy;
