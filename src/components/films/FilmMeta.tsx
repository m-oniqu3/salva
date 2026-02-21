"use client";

import RecentCollection from "@/components/collection/RecentCollection";
import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useRecentlySavedFilmContext } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  film: TMDBFilm;
  user: UserMeta;
};

function FilmMeta(props: Props) {
  const {
    film,
    film: { id, title },
    user,
  } = props;

  const {
    collectionLastSavedTo,
    savedFilms,
    setRecentlySavedFilm,
    removeRecentlySavedFilm,
  } = useRecentlySavedFilmContext();

  const isFilmRecentlySaved = !!savedFilms[id];

  const { openModal } = useModal();
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  function handleFilmCollectionModal() {
    openModal({
      type: ModalEnum.FCM,
      payload: { film, user },
    });
  }

  const queryClient = useQueryClient();
  async function handleSaveFilm() {
    try {
      if (!film || !collectionLastSavedTo) return;

      setIsLoading(true);

      setRecentlySavedFilm({
        filmID: film.id,
        collection: collectionLastSavedTo.name,
        savedToCollectionCount: 1,
      });

      const { error } = await addFilmToCollection({
        film,
        newIDs: [collectionLastSavedTo.id],
        deletedIDs: [],
      });

      if (error) throw error;

      toast(`Saved film to your collection.`);
      await queryClient.invalidateQueries({
        queryKey: ["films"],
        refetchType: "all",
      });

      queryClient.invalidateQueries({
        queryKey: ["collections", user?.username ?? ""],
      });
    } catch (error) {
      console.log(error);
      removeRecentlySavedFilm(film.id);
      toast("Failed to save film to your collection");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNavigation() {
    const route = `/film/${film.media_type}/${id}`;
    if (pathname === route) return;

    router.push(route);
  }

  return (
    <div
      onClick={handleNavigation}
      key={id}
      className={`absolute size-full inset-0 bg-neutral-700/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full p-4 z-5 sm:p-8 grid grid-rows-[auto_1fr] opacity-0 group-hover:opacity-100`}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="grid grid-cols-2  sm:grid-cols-[auto_auto] items-center justify-between w-full"
        >
          <div className="grid grid-cols-2 items-center sm:gap-2">
            <RecentCollection
              filmID={id}
              username={user?.username ?? null}
              className="text-white"
            />

            <button
              className="flex-center cursor-pointer w-fit"
              onClick={handleFilmCollectionModal}
            >
              <ChevronDownIcon className="size-6 text-white" />
            </button>
          </div>

          <button
            type="button"
            disabled={isLoading || !collectionLastSavedTo}
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
