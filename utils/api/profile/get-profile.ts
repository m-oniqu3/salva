"use server";

import { Result } from "@/types/result";
import { Profile } from "@/types/user";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  key: "username" | "user_id";
  value: string;
};

type Response = Result<Profile | null>;

export async function getProfile(props: Props): Response {
  try {
    const { key, value } = props;

    const supabase = await createClient();

    // Build base query.
    const baseQuery = supabase.from("profiles").select("*");

    const { data, error } =
      key === "username"
        ? await baseQuery.eq("username", value).single()
        : await baseQuery.eq("user_id", value).single();

    if (error) throw error;

    if (!data) {
      return { data: null, error: null };
    }

    return { data, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
