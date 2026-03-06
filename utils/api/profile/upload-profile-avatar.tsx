"use server";

import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

export async function uploadProfileAvatar(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file || file.size === 0) throw new Error("No file present.");

    const supabase = await createClient();

    const { data: auth, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!auth) return { data: null, error: null };

    const fileExt = file.name.split(".").pop();

    const filePath = `${auth.user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    return { data: filePath, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
