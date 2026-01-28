"use server";

import { Result } from "@/types/result";
import { Profile } from "@/types/user";
import { User } from "@supabase/supabase-js";
import { createClient } from "@utils/supabase/server";

type Props = {
  username?: string | null;
  id?: User["id"] | null;
};

type Response = Result<Profile | null>;

export async function getProfile(props: Props): Response {
  try {
    const { username, id } = props;

    // if (!username && !id) {
    //   return { data: null, error: null };
    // }

    const supabase = await createClient();

    // Build base query.
    const baseQuery = supabase.from("profiles").select("*");

    const { data, error } = username
      ? await baseQuery.eq("username", username).single()
      : await baseQuery.eq("user_id", id!).single();

    if (error) {
      throw new Error(`Failed to get profile : ${error.message}`);
    }

    if (!data) {
      return { data: null, error: null };
    }

    return { data, error: null };
  } catch (error) {
    console.error(`Error in ${getProfile.name}`, error);

    return {
      data: null,
      error:
        error instanceof Error ? error.message : "An unknown error occurred.",
    };
  }
}
