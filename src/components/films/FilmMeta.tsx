"use client";

import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { MostRecentCollection } from "@/types/collection";
import { ModalEnum } from "@/types/modal";
import { TMDBFilm } from "@/types/tmdb";
import { QueryClient } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  mostRecentCollection: MostRecentCollection | null;
  film: TMDBFilm;
};

function FilmMeta(props: Props) {
  const {
    film,
    film: { id, title },
    mostRecentCollection,
  } = props;

  const { openModal } = useModal();

  const qc = new QueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function handleFilmCollectionModal() {
    openModal({ type: ModalEnum.FCM, payload: { film } });
  }

  async function handleSaveFilm() {
    if (!film) return;

    if (mostRecentCollection) {
      setIsLoading(true);
      setIsSaved(true);

      // todo turn function parameters into one argument
      const { data, error } = await addFilmToCollection({
        film,
        addedIDs: [mostRecentCollection.id],
        deletedIDs: [],
      });

      if (data) {
        toast(`Saved film to your collection.`);
        // invalidate the query
        console.log("ivalidatinf the query");
        await qc.invalidateQueries({
          queryKey: ["collection", "films", id],
          refetchType: "all",
        });
      }

      if (error) {
        setIsSaved(false);
        toast("Failed to save film to your collection");
      }

      setIsLoading(false);
    }
  }

  return (
    <div
      key={id}
      className={`absolute inset-0 bg-neutral-700/40 opacity-0 group-hover:opacity-100 transition-opacity`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full p-4 sm:p-8 grid grid-rows-[auto_1fr] opacity-0 group-hover:opacity-100`}
      >
        <div className="grid grid-cols-2 items-center justify-between w-full">
          <div className="grid grid-cols-2 items-center sm:gap-2">
            <>
              <p className="sm:hidden font-semibold text-white line-clamp-1">
                ...
              </p>

              <p className="hidden sm:block  font-semibold text-white overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
                {mostRecentCollection ? mostRecentCollection.name : "..."}
              </p>
            </>

            <button
              className="flex-center cursor-pointer w-fit"
              onClick={handleFilmCollectionModal}
            >
              <ChevronDownIcon className="size-6 text-white" />
            </button>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSaveFilm}
            className={`bg-white text-neutral-800 rounded-full size-10 sm:size-12 grid place-items-center cursor-pointer ml-auto ${isSaved ? "opacity-70" : ""}`}
          >
            {isSaved ? (
              <CheckIcon className="size-5 text-neutral-800" />
            ) : (
              <AddIcon className="size-5 text-neutral-800" />
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
