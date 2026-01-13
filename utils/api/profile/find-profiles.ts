import { Result } from "@/types/result";
import { ProfileSnippet } from "@/types/user";
import { createClient } from "@utils/supabase/server";

export async function findProfiles(q: string): Result<ProfileSnippet[] | null> {
  try {
    if (!q) {
      throw new Error("A query is required to search for a profile.");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, username, firstname, lastname, avatar")
      .or(`firstname.ilike.%${q}%,username.ilike.%${q}%`);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error in findProfile:", error);

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred while trying to fetch profiles.",
    };
  }
}
