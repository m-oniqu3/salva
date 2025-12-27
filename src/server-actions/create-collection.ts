"use server";

import getUser from "@/server-actions/get-user";
import { Collection } from "@/types/collection";
import { Result } from "@/types/result";
import { createClient } from "@utils/supabase/server";
import { slugify } from "@utils/validation/slug";
import { revalidatePath } from "next/cache";

export async function createCollection(
  formData: FormData
): Promise<Result<Collection | null>> {
  const supabase = await createClient();

  try {
    // Validate the FormData
    const values = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      is_private: formData.get("private") === "true",
      slug: slugify(formData.get("name") as string),
    };

    console.log("Form values:", values);

    const slug = slugify(values.name);

    console.log(slug);

    // Get logged-in user
    const { data: user, error: userError } = await getUser(supabase);

    if (userError || !user) {
      return {
        data: null,
        error:
          "It looks like you're not logged in. Please log in to create a collection.",
      };
    }

    // Insert into DB
    const { data: collection, error: collectionErr } = await supabase
      .from("collections")
      .insert({ ...values, user_id: user.id })
      .select()
      .single();

    if (collectionErr) {
      console.error("Supabase insert error:", collectionErr);

      return {
        data: null,
        error: "We're sorry, but we couldn't create this collection.",
      };
    }

    console.log("Collection created:", collection);

    // Revalidate profile page cache
    revalidatePath("/[profile]", "page");

    return { data: collection, error: null };
  } catch (err) {
    console.error("Unexpected error in createCollection:", err);

    return {
      data: null,
      error: "Something went wrong while creating your collection.",
    };
  }
}
