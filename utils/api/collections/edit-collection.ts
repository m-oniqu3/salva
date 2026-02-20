"use server";

import { CollectionCover } from "@/types/collection";
import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  collection: {
    id: number;
    name?: string;
    description?: string;
    cover_image?: string;
    cover_type?: CollectionCover;
  };
};

export async function editCollection(props: Props): Result<null> {
  const {
    collection: { id, name, description, cover_image, cover_type },
  } = props;

  try {
    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!auth.user) return { data: null, error: null };

    const { error } = await supabase
      .from("collections")
      .update({
        ...(name && { name }),
        ...(description && { description }),
        ...(cover_image && { cover_image }),
        ...(cover_type && cover_image && { cover_type }),
      })
      .eq("id", id)
      .eq("user_id", auth.user.id);

    if (error) throw error;

    return { data: null, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
