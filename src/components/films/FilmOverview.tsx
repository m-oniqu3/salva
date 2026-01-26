"use client";

import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useRecentlySavedFilm } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
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
  user: { id: string; username: string } | null;
};

function FilmOverview(props: Props) {
  const { film, media_type, user } = props;

  const title = "title" in film ? film.title : film.name;

  const date = new Date(
    ("release_date" in film ? film.release_date : film.first_air_date) ?? "",
  );
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    // month: "long",
    // day: "numeric",
  });

  const creators = "created_by" in film ? "Creators:" : "";
  const creators_list =
    "created_by" in film
      ? film.created_by.map((c) => c.name ?? c.original_name).join(", ")
      : null;

  const production =
    "production_companies" in film ? "Production Companies:" : "";
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
  const { openModal } = useModal();

  // Get collection the user last added to
  const { data: recentCollection, isLoading: isLoadingRecentCollection } =
    useQuery({
      queryKey: ["collection", "recent", user?.id],
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
      payload: { film: filmMeta, userID: user?.id ?? null },
    });
  }

  return (
    <section className="bg-white p-8 h-full w-full max-w-100 flex flex-col gap-10 border-l border-gray-50">
      <header className=" grid grid-cols-[1fr_auto] gap-4 items-center">
        <>
          <div className="grid grid-cols-[1fr_auto] items-center w-fit sm:gap-2">
            <>
              {!isLoadingRecentCollection ? (
                <p className="hidden sm:block text-sm  text-zinc-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
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
                <p className="hidden sm:block  font-semibold text-neutral-800 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                  ...
                </p>
              )}
            </>

            {
              <button
                className="flex-center cursor-pointer w-fit"
                onClick={handleFilmCollectionModal}
              >
                <ChevronDownIcon className="size-5 text-zinc-500" />
              </button>
            }
          </div>
        </>

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
      </header>

      <article className="flex flex-col gap-2">
        <p className="text-xs font-medium text-zinc-500">{formattedDate}</p>
        <h1 className="font-semibold text-xl">{title}</h1>

        <p className="text-sml font-medium text-zinc-500">{film.tagline}</p>

        <p className="text-sml leading-6 py-4">{film.overview}</p>

        <p className="text-sml ">
          <span className="">Genres:</span>
          &nbsp;
          <span className="text-zinc-500">
            {film.genres.map((genre) => genre.name).join(", ")}.
          </span>
        </p>

        {creators_list && (
          <p className="text-sml">
            <span>{creators}</span>
            &nbsp;
            <span className="text-zinc-500">{creators_list}</span>.
          </p>
        )}

        {production_companies && (
          <p className="text-sml">
            <span>{production}</span>
            &nbsp;
            <span className="text-zinc-500">{production_companies}</span>.
          </p>
        )}
      </article>
    </section>
  );
}

export default FilmOverview;
