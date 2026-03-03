"use server";

import { Result } from "@/types/result";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Response = Result<number[] | null>;

// Get the collections a film is saved to
export async function getFilmCollections(filmID: number): Response {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      throw new Error("Not authenticated");
    }

    // Get the collections the film is saved in
    const { data, error } = await supabase
      .from("collection_films")
      .select("collection_id")
      .eq("user_id", auth.user.id)
      .eq("film_id", filmID)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const ids = data.map((col) => col.collection_id);

    return { data: ids, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
