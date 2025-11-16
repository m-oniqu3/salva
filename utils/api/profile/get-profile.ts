import { Result } from "@/types/result";
import { Profile } from "@/types/user";
import { User } from "@supabase/supabase-js";
import { createClient } from "@utils/supabase/server";

type Props = {
  username?: string | null;
  id?: User["id"] | null;
};

type Response = Promise<Result<Profile | null>>;

export async function getProfile(props: Props): Response {
  const supabase = await createClient();

  const { username, id } = props;

  console.log(props);

  async function findProfile() {
    if (username) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      return { data, error };
    }

    if (id) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", id)
        .single();

      return { data, error };
    }

    return { data: null, error: "No identifier provided" };
  }
  //   return { data: null, error: "No identifier provided" };
  // }

  const { data, error } = await findProfile();

  if (error) {
    console.error("Error fetching profile data", error);
    return { data: null, error: "Could not find profile" };
  }

  if (!data) {
    return {
      data: null,
      error: "Could not find profile",
    };
  }

  return { data, error: null };
}
