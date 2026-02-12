"use client";

import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useRecentlySavedFilm } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { getMostRecentCollection } from "@utils/api/collections/get-most-recent-collection";
import { slugify } from "@utils/validation/slug";
import Link from "next/link";
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

  // Get collection the user last added to
  const { data: recentCollection, isLoading: isLoadingRecentCollection } =
    useQuery({
      queryKey: ["collection", "recent", user?.userID],
      queryFn: () => getMostRecentCollection(),
    });

  // Get recently saved films and check if the current film was recently saved
  const { savedFilms, setRecentlySavedFilm, removeRecentlySavedFilm } =
    useRecentlySavedFilm();
  const isFilmRecentlySaved =
    !!savedFilms[film.id] && savedFilms[film.id].collectionAmt > 0;
  const recentlySavedFilm = savedFilms[film.id];

  async function handleSaveFilm() {
    if (!film) return;

    if (recentCollection?.data) {
      setIsLoading(true);

      setRecentlySavedFilm({
        filmID: film.id,
        collection: recentCollection.data.name,
        collectionAmt: 1,
      });

      const { data, error } = await addFilmToCollection({
        film: filmMeta,
        newIDs: [recentCollection.data.id],
        deletedIDs: [],
      });

      if (data) {
        toast(`Saved film to your collection.`);
      }

      if (error) {
        removeRecentlySavedFilm(film.id);
        toast("Failed to save film to your collection");
      }

      setIsLoading(false);
    }
  }

  function handleFilmCollectionModal() {
    openModal({
      type: ModalEnum.FCM,
      payload: { film: filmMeta, userID: user?.userID ?? null },
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
    <section className="relative bg-white h-screen w-full max-w-100 grid grid-rows-[100px_auto] border-l border-gray-50 overflow-y-scroll no-scrollbar">
      <header className="w-full sticky top-0 left-0 flex-center border-b border-gray-50 bg-white ">
        <div className="wrapper grid grid-cols-[1fr_auto] gap-4 items-center ">
          <div className="grid grid-cols-2 items-center w-fit sm:gap-2">
            {!isLoadingRecentCollection ? (
              <p className="hidden sm:block text-neutral-800 font-medium overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                {isFilmRecentlySaved && user && (
                  <Link
                    href={`/${user.username}/${slugify(recentlySavedFilm.collection)}`}
                    className="underline-offset-2 hover:underline"
                  >
                    {!recentlySavedFilm.collection
                      ? "Saved"
                      : `${recentlySavedFilm.collection}  ${recentlySavedFilm.collectionAmt > 1 ? `+ ${(recentlySavedFilm.collectionAmt - 1).toString().padStart(2, "0")} ` : ""}`}
                  </Link>
                )}

                {!isFilmRecentlySaved && recentCollection?.data
                  ? recentCollection.data.name
                  : "..."}
              </p>
            ) : (
              <p className="hidden sm:block font-semibold text-neutral-800 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                ...
              </p>
            )}

            {
              <button
                className="flex-center cursor-pointer w-fit"
                onClick={handleFilmCollectionModal}
              >
                <ChevronDownIcon className="size-5 text-zinc-500" />
              </button>
            }
          </div>

          <button
            className="bg-neutral-800 rounded-full size-10 sm:size-12 grid place-items-center cursor-pointer"
            type="button"
            disabled={isLoading || isLoadingRecentCollection}
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

      <article className="flex flex-col gap-4 wrapper py-12">
        <p className="text-sml text-zinc-500">{formattedDate}</p>
        <h1 className="font-semibold text-xl text-neutral-800">{title}</h1>

        <p className="text-sml text-zinc-500">{film.tagline}</p>

        <p className="text-sml leading-6">{film.overview}</p>

        <div className="flex flex-col gap-4 py-4">
          <p className="text-sml">
            Genres - &nbsp;
            <span className="text-zinc-500">
              {film.genres.map((genre) => genre.name).join(", ")}.
            </span>
          </p>

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
