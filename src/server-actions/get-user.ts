import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@utils/supabase/database.types";

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (
  supabase: SupabaseClient<Database>,
  resource: string
) {
  const { data, error } = await supabase.auth.getUser();

  // check if a user is logged in
  if (error || !data.user) {
    return {
      user: null,
      error: `It looks like you're not logged in. Please log in to create a ${resource}.`,
    };
  }

  console.log("got the user ", data.user.id);

  return { user: data.user, error: null };
}
