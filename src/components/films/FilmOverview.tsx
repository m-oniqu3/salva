"use client";

import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useState } from "react";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: UserMeta;
  credits: Credits;
  recommendations: TMDBFilm[];
};
function joinArray(array: Array<{ name: string }>) {
  return array.map((el) => el.name).join(", ");
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(",", max));
}

function FilmOverview(props: Props) {
  const { film, credits } = props;

  const title = "title" in film ? film.title : film.name;

  const date = new Date(
    ("release_date" in film ? film.release_date : film.first_air_date) ?? "",
  );
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    // month: "long",
    // day: "numeric",
  });

  const creators_list =
    "created_by" in film
      ? film.created_by.map((c) => c.name ?? c.original_name).join(", ")
      : null;

  const production_companies =
    "production_companies" in film
      ? film.production_companies.map((pc) => pc.name).join(", ")
      : null;

  const [cast, setCast] = useState(truncate(joinArray(credits.cast), 120));
  const [isCastTruncated, setIsCastTruncated] = useState(true);

  const [crew, setCrew] = useState(truncate(joinArray(credits.crew), 120));
  const [isCrewTruncated, setIsCrewTruncated] = useState(true);

  function handleCastTruncation() {
    if (isCastTruncated) {
      setCast(joinArray(credits.cast));
    } else {
      setCast(truncate(joinArray(credits.cast), 120));
    }

    setIsCastTruncated((prev) => !prev);
  }

  function handleCrewTruncation() {
    if (isCrewTruncated) {
      setCrew(joinArray(credits.crew));
    } else {
      setCrew(truncate(joinArray(credits.crew), 120));
    }

    setIsCrewTruncated((prev) => !prev);
  }

  return (
    <section className="w-full h-[calc(100dvh-8rem)] relative  flex flex-col border-l border-gray-50/50 overflow-y-scroll no-scrollbar">
      <article className="flex flex-col gap-4 wrapper py-12 h-full overflow-y-scroll no-scrollbar">
        <p className="text-sml text-zinc-500">{formattedDate}</p>
        <div>
          <h1 className="font-semibold text-lg text-neutral-800">{title}</h1>
          <p className="text-sml text-zinc-500">{film.tagline}</p>
        </div>

        <p className="text-sml leading-6 pt-8 ">{film.overview}</p>

        <div className="flex flex-col gap-4 py-4">
          {credits.cast && (
            <p className="text-sml text-zinc-500">
              <span className="shrink-0 text-black">Cast - &nbsp;</span>
              {cast}
              {isCastTruncated && `...`} &nbsp;
              <button
                onClick={handleCastTruncation}
                className="text-black cursor-pointer"
              >
                {isCastTruncated ? "Show All" : "...Show Less"}
              </button>
            </p>
          )}

          {credits.crew && (
            <p className="text-sml text-zinc-500">
              <span className="shrink-0 text-black">Crew - &nbsp;</span>
              {crew}
              {isCrewTruncated && `...`} &nbsp;
              <button
                onClick={handleCrewTruncation}
                className="text-black cursor-pointer"
              >
                {isCrewTruncated ? "Show All" : "...Show Less"}
              </button>
            </p>
          )}

          {creators_list && (
            <p className="text-sml">
              Creators - &nbsp;
              <span className="text-zinc-500">{creators_list}</span>.
            </p>
          )}

          {production_companies && (
            <p className="text-sml">
              Production Companies - &nbsp;
              <span className="text-zinc-500">{production_companies}</span>.
            </p>
          )}
        </div>

        {/* {film.backdrop_path && (
          <figure className="py-8">
            <Image
              src={film.backdrop_path}
              alt={"title" in film ? film.title : film.name}
              width={100}
              height={100}
              quality={75}
              className="object-cover h-48 w-full gray"
            />
          </figure>
        )} */}
      </article>
    </section>
  );
}

export default FilmOverview;
