"use server";

import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";
import { slugify } from "@utils/validation/slug";

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

    // Does the collection already exist
    const { data: duplicate, error: duplicateError } = await supabase
      .from("collections")
      .select("name,slug")
      .eq("name", values.name)
      .maybeSingle();

    if (duplicateError) throw duplicateError;

    if (duplicate) throw new Error("Collection already exists");

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
    //revalidatePath(`/${username}`, "page");

    return {
      data: { slug: data.slug, username },
      error: null,
    };
  } catch (error) {
    return formErrorMesage(error);
  }
}
