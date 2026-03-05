"use server";

import { Result } from "@/types/result";
import { ProfileSummary } from "@/types/user";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  username: string;
};

type Response = Result<ProfileSummary | null>;

export async function getProfileSummary(props: Props): Response {
  try {
    const { username } = props;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        `
      user_id,
      username,
      firstname,
      lastname,
      avatar,
      bio,
      collections(id)`,
      )
      .eq("username", username)
      .single();

    if (error) throw error;

    if (!data) {
      return { data: null, error: null };
    }

    const { collections, ...profile } = data;

    const summary = { ...profile, collections_created: collections.length };

    return { data: summary, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
