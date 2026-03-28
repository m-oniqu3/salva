"use client";

import RecentCollection from "@/components/collection/RecentCollection";
import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useRecentlySavedFilmContext } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { useState } from "react";
import { toast } from "sonner";

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
  const { film, media_type, user, credits, recommendations } = props;

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

  const filmMeta: TMDBFilm = {
    id: film.id,
    title: title,
    poster_path: film.poster_path ?? "",
    media_type,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [cast, setCast] = useState(truncate(joinArray(credits.cast), 120));
  const [isCastTruncated, setIsCastTruncated] = useState(true);

  const [crew, setCrew] = useState(truncate(joinArray(credits.crew), 120));
  const [isCrewTruncated, setIsCrewTruncated] = useState(true);
  const { openModal } = useModal();

  // Get recently saved films and check if the current film was recently saved
  const {
    collectionLastSavedTo,
    savedFilms,
    setRecentlySavedFilm,
    removeRecentlySavedFilm,
  } = useRecentlySavedFilmContext();

  const isFilmRecentlySaved = !!savedFilms[film.id];
  const queryClient = useQueryClient();
  async function handleSaveFilm() {
    if (!film) return;

    try {
      if (collectionLastSavedTo) {
        setIsLoading(true);

        setRecentlySavedFilm({
          filmID: film.id,
          collection: collectionLastSavedTo.name,
          savedToCollectionCount: 1,
        });

        const { error } = await addFilmToCollection({
          film: filmMeta,
          newIDs: [collectionLastSavedTo.id],
          deletedIDs: [],
        });

        if (error) throw error;

        toast(`Saved film to your collection.`);
        queryClient.invalidateQueries({
          queryKey: ["film", film.id, "collections"],
          refetchType: "all",
        });

        queryClient.invalidateQueries({
          queryKey: ["collections", user?.username ?? ""],
        });

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      removeRecentlySavedFilm(film.id);
      toast("Failed to save film to your collection");
    } finally {
      setIsLoading(false);
    }
  }

  function handleFilmCollectionModal() {
    openModal({
      type: ModalEnum.FCM,
      payload: { film: filmMeta, user },
    });
  }

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
    <section className="w-full relative h-[100dvh] flex flex-col border-l border-gray-50/50 overflow-y-scroll no-scrollbar">
      <header className="h-20 w-full sticky top-0 left-0 flex-center border-b border-gray-50/50 bg-white ">
        <div className="wrapper grid grid-cols-[1fr_auto]  gap-4 items-center ">
          <div className="grid grid-cols-2 items-center w-full gap-2">
            <RecentCollection
              filmID={film.id}
              username={user?.username ?? null}
              className="text-sml"
            />

            <button
              className="flex-center cursor-pointer w-fit"
              onClick={handleFilmCollectionModal}
            >
              <ChevronDownIcon className="size-5 text-zinc-500" />
            </button>
          </div>

          <button
            className="bg-neutral-800 rounded-full size-10 grid place-items-center cursor-pointer disabled:opacity-50"
            type="button"
            disabled={
              isLoading || !collectionLastSavedTo || isFilmRecentlySaved
            }
            onClick={handleSaveFilm}
          >
            {isFilmRecentlySaved ? (
              <CheckIcon className={`size-5 text-white`} />
            ) : (
              <AddIcon className={`size-5 text-white`} />
            )}
          </button>
        </div>
      </header>

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
