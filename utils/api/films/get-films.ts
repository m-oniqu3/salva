"use server";

import { Result } from "@/types/result";
import { SavedTMDBFilm } from "@/types/tmdb";
import formErrorMesage from "@utils/form-error-message";
import { createClient } from "@utils/supabase/server";

type Response = Result<SavedTMDBFilm[] | null>;

type Props = {
  userID: string;
  range: [number, number];
  collectionID?: number;
};

export async function getFilms(props: Props): Response {
  try {
    const { userID, range, collectionID } = props;
    const [page, end] = range;

    const supabase = await createClient();

    //if no id then get all the films
    const getAllFilmsQuery = supabase
      .from("collection_films")
      .select("id, film_id")
      .eq("user_id", userID)
      .order("created_at", { ascending: false })
      .range(page, end);

    const getAllFilmsForCollection = supabase
      .from("collection_films")
      .select("id,film_id")
      .eq("collection_id", collectionID as number)
      .order("created_at", { ascending: false })
      .range(page, end);

    const query = collectionID ? getAllFilmsForCollection : getAllFilmsQuery;

    const { data: filmMetas, error: filmMetasError } = await query;

    if (filmMetasError) throw filmMetasError;
    if (!filmMetas) return { data: null, error: null };

    const metaMap = new Map(
      filmMetas.map((entry) => [entry.film_id, entry.id]),
    );
    const filmIDs = Array.from(metaMap.keys());

    // Get the films
    const { data, error } = await supabase
      .from("films")
      .select("id,title,media_type,poster_path")
      .in("id", filmIDs);

    if (error) throw error;
    if (!data) return { data: null, error: null };

    const filmsById = new Map(data.map((f) => [f.id, f]));

    // use reduce instead
    const orderedFilms = filmIDs
      .map((id) => {
        const film = filmsById.get(id);
        const cfid = metaMap.get(id);

        if (!film || !cfid) return;

        return {
          ...film,
          id: cfid,
          filmID: id,
        };
      })
      .filter((f) => f !== undefined);

    return { data: orderedFilms, error: null };
  } catch (error) {
    return formErrorMesage(error);
  }
}
