"use server";

import { createClient } from "@utils/supabase/server";

export async function getAuthUser() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    if (!data.user) throw new Error("Unauthenticated");

    return data.user;
  } catch (error) {
    throw error;
  }
}
