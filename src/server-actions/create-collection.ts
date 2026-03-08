"use server";

import { Result } from "@/types/result";
import { TMDBFilm } from "@/types/tmdb";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { getAuthUser } from "@utils/api/user/get-auth-user";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";
import { slugify } from "@utils/validation/slug";
import { revalidatePath } from "next/cache";

type Props = {
  collection: { name: string; description?: string; isPrivate: boolean };
  film?: TMDBFilm;
};

type CreateCollectionResponse = Result<{
  collection: { id: number; slug: string };

  user: {
    username: string;
    user_id: string;
  };
} | null>;

export async function createCollection(props: Props): CreateCollectionResponse {
  try {
    const {
      film,
      collection: { name, description = "", isPrivate },
    } = props;
    const slug = slugify(name);

    const supabase = await createClient();

    // Get logged-in user
    const user = await getAuthUser();

    // Does the collection already exist
    const { data: duplicate, error: duplicateError } = await supabase
      .from("collections")
      .select("name, slug")
      .eq("name", name)
      .maybeSingle();

    if (duplicateError) throw duplicateError;
    if (duplicate) throw new Error("Collection already exists");

    // Insert into DB
    const { data, error: collectionErr } = await supabase
      .from("collections")
      .insert({
        name,
        description,
        is_private: isPrivate,
        slug,
        user_id: user.id,
      })
      .select(
        `id,
        slug, 
        profiles(username)
        `,
      )
      .single();

    if (collectionErr) throw collectionErr;
    if (!data) throw new Error("Insertion failed");

    // Insert the film
    if (film) {
      console.log("new colelction", film);
      const { error } = await addFilmToCollection({ film, newIDs: [data.id] });
      if (error) throw error;
    }

    const username = data.profiles.username;

    // Revalidate profile page cache
    revalidatePath(`/${username}`, "page");

    return {
      data: {
        collection: { id: data.id, slug: data.slug },
        user: { username, user_id: user.id },
      },
      error: null,
    };
  } catch (error) {
    return formErrorMesage(error);
  }
}
