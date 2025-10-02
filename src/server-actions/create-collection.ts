"use server";

import getUser from "@/server-actions/get-user";
import { createClient } from "@utils/supabase/server";
import { NewCollectionSchema } from "@utils/validation/create-collection";

export async function createCollection(formData: FormData) {
  const supabase = await createClient();

  try {
    //validate the FormData
    const values = NewCollectionSchema.parse({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      is_private: formData.get("private") === "true" ? true : false,
    });

    const { user, error } = await getUser(supabase, "collection");

    if (error || !user) return { data: null, error };

    const { data: collection, error: collectionErr } = await supabase
      .from("collections")
      .insert({ ...values, user_id: user.id })
      .select()
      .single();

    if (collectionErr) {
      console.log(collectionErr);

      return {
        data: null,
        error: `We're sorry, but we couldn't create this collection.`,
      };
    }

    console.log("collection created ", collection);

    return { data: `Collection created.`, error: null };
  } catch (error) {
    console.log("Error in create-collection:", error);

    return {
      data: null,
      error: `We're sorry, but we couldn't create this collection.`,
    };
  }
}
