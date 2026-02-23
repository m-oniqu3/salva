import { createClient } from "@utils/supabase/server";

export async function checkAuthUser() {
  const supabase = await createClient();

  const { data: auth, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;

  if (!auth.user) return { data: null, error: null };

  return { data: auth.user, error: null };
}
