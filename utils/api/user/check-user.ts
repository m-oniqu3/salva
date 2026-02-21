"use server";

import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

export async function checkUser(username: string) {
  const supabase = await createClient();

  //get the profile and auth user
  const [profile, currentUser] = await Promise.all([
    getProfile({ key: "username", value: username }),
    supabase.auth.getUser(),
  ]);

  const { data } = profile;
  const { data: auth } = currentUser;

  return data?.user_id === auth.user?.id;
}
