"use server";

import { Result } from "@/types/result";
import { TMDBFilm } from "@/types/tmdb";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Props = {
  range: [number, number];
};

type Response = Result<TMDBFilm[] | null>;

export async function getAllFilms(props: Props): Response {
  try {
    const { range } = props;
    const [page, end] = range;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("films")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page, end);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
