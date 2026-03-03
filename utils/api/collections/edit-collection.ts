"use server";

import { CollectionCover } from "@/types/collection";
import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";
import { slugify } from "@utils/validation/slug";

type Props = {
  collection: {
    id: number;
    name?: string;
    description?: string;
    cover_image?: string;
    cover_type?: CollectionCover;
  };
};
type Response = Result<{ slug: string; username: string } | null>;

export async function editCollection(props: Props): Response {
  const {
    collection: { id, name, description, cover_image, cover_type },
  } = props;

  try {
    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!auth.user) return { data: null, error: null };

    const slug = name && slugify(name);

    const { data, error } = await supabase
      .from("collections")
      .update({
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(cover_image && { cover_image }),
        ...(cover_type && cover_image && { cover_type }),
      })
      .eq("id", id)
      .eq("user_id", auth.user.id)
      .select(
        `slug,
        profiles(username)
        
        `,
      )
      .single();

    if (error) throw error;

    if (!data) {
      return { data: null, error: null };
    }

    const result = { slug: data.slug, username: data.profiles.username };

    return { data: result, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
