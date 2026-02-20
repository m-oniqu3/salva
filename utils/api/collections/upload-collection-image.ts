"use server";

import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type UploadCollectionResponse = Result<string | null>;

export async function uploadCollectionImage(
  formData: FormData,
): UploadCollectionResponse {
  try {
    console.log(formData);

    const file = formData.get("cover_image") as File;
    const collection_id = formData.get("collection_id") as string;

    if (!file || file.size === 0) throw new Error("No file present.");
    if (!collection_id) return { data: null, error: null };

    const fileExt = file.name.split(".").pop();

    const supabase = await createClient();

    const { data: auth, error: userError } = await supabase.auth.getUser();

    if (userError) throw userError;

    if (!auth) return { data: null, error: null };

    const filePath = `${auth.user.id}/collection/${collection_id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("collection_covers")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    return { data: filePath, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
