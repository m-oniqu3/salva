"use client";

import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useRecentlySavedFilm } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { TMDBFilm } from "@/types/tmdb";
import { useQuery } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { getMostRecentCollection } from "@utils/api/collections/get-most-recent-collection";
import { slugify } from "@utils/validation/slug";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  film: TMDBFilm;
  user: { id: string; username: string } | null;
};

function FilmMeta(props: Props) {
  const {
    film,
    film: { id, title },
    user,
  } = props;

  const { savedFilms, setRecentlySavedFilm, removeRecentlySavedFilm } =
    useRecentlySavedFilm();
  const isFilmRecentlySaved =
    !!savedFilms[id] && savedFilms[id].collectionAmt > 0;
  const recentlySavedFilm = savedFilms[id];

  const { openModal } = useModal();

  const { data: recentCollection, isLoading: isLoadingRecentCollection } =
    useQuery({
      queryKey: ["collection", "recent", user?.id],
      queryFn: () => getMostRecentCollection(),
    });

  const [isLoading, setIsLoading] = useState(false);

  function handleFilmCollectionModal() {
    openModal({
      type: ModalEnum.FCM,
      payload: { film, userID: user?.id ?? null },
    });
  }

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
        film,
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

  return (
    <div
      key={id}
      className={`absolute size-full inset-0 bg-neutral-700/40 opacity-0 group-hover:opacity-100 transition-opacity`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full p-4 sm:p-8 grid grid-rows-[auto_1fr] opacity-0 group-hover:opacity-100`}
      >
        <div className="grid grid-cols-2  sm:grid-cols-[auto_auto] items-center justify-between w-full">
          <div className="grid grid-cols-2 items-center sm:gap-2">
            <>
              <p className="sm:hidden font-semibold text-white line-clamp-1">
                ...
              </p>

              {!isLoadingRecentCollection ? (
                <p className="hidden sm:block  font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
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
                <p className="hidden sm:block  font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                  ...
                </p>
              )}
            </>

            {
              <button
                className="flex-center cursor-pointer w-fit"
                onClick={handleFilmCollectionModal}
              >
                <ChevronDownIcon className="size-6 text-white" />
              </button>
            }
          </div>

          <button
            type="button"
            disabled={isLoading || isLoadingRecentCollection}
            onClick={handleSaveFilm}
            className={`bg-white text-neutral-800 rounded-full size-10 sm:size-12 grid place-items-center cursor-pointer ml-auto ${isFilmRecentlySaved ? " opacity-70" : ""}`}
          >
            {isFilmRecentlySaved ? (
              <CheckIcon className={`size-5 text-neutral-800`} />
            ) : (
              <AddIcon className={`size-5 text-neutral-800"`} />
            )}
          </button>
        </div>

        <p className="text-base font-semibold  text-white line-clamp-3 self-end">
          {title}
        </p>
      </div>
    </div>
  );
}

export default FilmMeta;
