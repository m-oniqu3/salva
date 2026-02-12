import { TMDBFilm } from "@/types/tmdb";
import { createClient } from "@utils/supabase/server";
import { NextResponse } from "next/server";

type ApiResponse<T> = {
  data: T | null;
  error: string | null;
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userID = searchParams.get("userID");
    const collectionID = searchParams.get("collectionID");
    const page = Number(searchParams.get("page") ?? 1);

    if (!userID) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Missing userID" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    const from = (page - 1) * 10;
    const to = from + 9;

    const baseQuery = supabase
      .from("collection_films")
      .select("id, film_id")
      .eq("user_id", userID)
      .range(from, to);

    const query = collectionID
      ? baseQuery.eq("collection_id", Number(collectionID))
      : baseQuery;

    const { data: filmMetas, error: filmMetasError } = await query;

    if (filmMetasError) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: filmMetasError.message },
        { status: 500 },
      );
    }

    if (!filmMetas || filmMetas.length === 0) {
      return NextResponse.json<ApiResponse<TMDBFilm[]>>({
        data: [],
        error: null,
      });
    }

    const filmIDs = filmMetas.map((film) => film.film_id);

    const { data, error } = await supabase
      .from("films")
      .select("id,title,media_type,poster_path")
      .in("id", filmIDs);

    if (error) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json<ApiResponse<TMDBFilm[]>>({
      data,
      error: null,
    });
  } catch (err) {
    console.error("ROUTE ERROR", err);

    return NextResponse.json<ApiResponse<null>>(
      {
        data: null,
        error: err instanceof Error ? err.message : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
