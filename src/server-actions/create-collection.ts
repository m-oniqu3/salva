"use server";

import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";
import { slugify } from "@utils/validation/slug";
import { revalidatePath } from "next/cache";

export async function createCollection(
  formData: FormData,
): Result<{ slug: string; username: string } | null> {
  try {
    // Validate the FormData
    const values = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      is_private: formData.get("private") === "true",
      slug: slugify(formData.get("name") as string),
    };

    const supabase = await createClient();

    // Get logged-in user
    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!auth) return { data: null, error: null };

    // Insert into DB
    const { data, error: collectionErr } = await supabase
      .from("collections")
      .insert({ ...values, user_id: auth.user.id })
      .select(
        `
        slug, 
        profiles(username)
        `,
      )
      .single();

    if (collectionErr) throw collectionErr;

    const username = data.profiles.username;

    // Revalidate profile page cache
    revalidatePath(`/${username}`, "page");

    return {
      data: { slug: data.slug, username },
      error: null,
    };
  } catch (error) {
    return formErrorMesage(error);
  }
}
