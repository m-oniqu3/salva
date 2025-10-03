import { Result } from "@/types/result";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { Database } from "@utils/supabase/database.types";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (
  supabase: SupabaseClient<Database>
): Promise<Result<User | null>> {
  const { data, error } = await supabase.auth.getUser();

  // check if a user is logged in

  if (error) {
    return { data: null, error: error.message };
  }

  if (!data) {
    return { data: null, error: "No user found." };
  }

  console.log("got the user ", data.user.id);

  return { error: null, data: data.user };
}
