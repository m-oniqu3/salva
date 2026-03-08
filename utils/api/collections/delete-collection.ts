"use server";

import { Result } from "@/types/result";
import { getAuthUser } from "@utils/api/user/get-auth-user";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

// delte collection (ensure that collection films get deleted too-- check the cascade foreign key rules )

type Props = {
  collection: { id: number };
};

export async function deleteCollection(props: Props): Result<null> {
  try {
    const { id } = props.collection;

    const user = await getAuthUser();
    const supabase = await createClient();

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return { data: null, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
