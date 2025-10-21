import { Result } from "@/types/result";
import { Profile } from "@/types/user";
import { createClient } from "@utils/supabase/server";

export async function getProfile(
  user: string
): Promise<Result<Profile | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("username", user)
    .single();

  if (error) {
    console.error("Error fetching profile data", error);
    return { data, error: "Could not get user profile" };
  }

  return { data, error: null };
}
