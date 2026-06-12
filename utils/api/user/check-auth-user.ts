import { createClient } from "@utils/supabase/server";

// Gets the auth user.
export async function checkAuthUser() {
  try {
    const supabase = await createClient();

    const { data: auth, error: authError } = await supabase.auth.getUser();

    if (authError) throw authError;

    if (!auth.user) return { data: null, error: null };

    return { data: auth.user, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: null };
  }
}
