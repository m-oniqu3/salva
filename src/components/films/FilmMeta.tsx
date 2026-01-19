"use client";

import { AddIcon, CheckIcon, ChevronDownIcon } from "@/components/icons";
import { useContextMenu } from "@/context/useContextMenu";
import useClientRect from "@/hooks/useClientRect";
import { MostRecentCollection } from "@/types/collection";
import { ContextMenuEnum } from "@/types/context-menu";
import { TMDBFilm } from "@/types/tmdb";
import { QueryClient } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  mostRecentCollection: MostRecentCollection | null;
  film: TMDBFilm;
  userID: string;
};

function FilmMeta(props: Props) {
  const {
    film,
    film: { id, title },
    mostRecentCollection,
    userID,
  } = props;

  const {
    openContextMenu,
    state: { menu },
  } = useContextMenu();
  const qc = new QueryClient();
  const { ref: filmRef, rect } = useClientRect<HTMLButtonElement>();

  const [activeFilm, setActiveFilm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  function handleCollectionPickerContextMenu(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    if (!rect) return;

    const MENU_WIDTH = 320;
    const MENU_HEIGHT = 360; // estimate or known height
    const PADDING = 16;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Start by positioning below the trigger
    let left = rect.left;
    let top = rect.bottom + 8;

    // Clamp horizontally
    if (left + MENU_WIDTH > viewportWidth - PADDING) {
      left = viewportWidth - MENU_WIDTH - PADDING;
    }

    if (left < PADDING) {
      left = PADDING;
    }

    // Clamp vertically
    if (top + MENU_HEIGHT > viewportHeight - PADDING) {
      // flip above trigger if it doesn't fit below
      top = rect.top - MENU_HEIGHT - 8;
    }

    if (top < PADDING) {
      top = PADDING;
    }

    setActiveFilm(id);
    openContextMenu({
      type: ContextMenuEnum.CPM,
      position: { top: top + 20, left },
      payload: { userID, film },
    });
  }

  useEffect(() => {
    if (menu && menu.type !== ContextMenuEnum.CPM) {
      setActiveFilm(null);
    }

    if (!menu) {
      setActiveFilm(null);
    }
  }, [menu]);

  // useEffect(() => {
  //   window.addEventListener("resize", () => {
  //     setActiveFilm(null);
  //     closeContextMenu();
  //   });

  //   return () => {
  //     window.removeEventListener("resize", () => {
  //       setActiveFilm(null);
  //       closeContextMenu();
  //     });
  //   };
  // }, [closeContextMenu]);

  async function handleSaveFilm() {
    if (!film) return;

    if (mostRecentCollection) {
      setIsLoading(true);
      setIsSaved(true);

      toast(`Saved film to your collection.`);

      const { data, error } = await addFilmToCollection({
        film,
        addedIDs: [mostRecentCollection.id],
        deletedIDs: [],
      });

      if (data) {
        // invalidate the query
        qc.invalidateQueries({
          queryKey: ["collection", "meta"],
          refetchType: "none",
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
      className={`absolute inset-0 bg-neutral-700/40 opacity-0 group-hover:opacity-100 transition-opacity ${activeFilm === id ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full p-3 grid grid-rows-[auto_1fr] opacity-0 group-hover:opacity-100 xs:p-4 ${activeFilm === id ? "opacity-100" : "opacity-0"}`}
      >
        <div className="grid grid-cols-[auto_auto] items-center justify-between gap-2">
          <p className=" grid grid-cols-[auto_1fr] gap-1 ">
            <span className="flex-center px-2 text-base font-semibold text-white line-clamp-1">
              {mostRecentCollection ? mostRecentCollection.name : "..."}
            </span>

            <button
              ref={filmRef}
              className="flex-center cursor-pointer w-fit"
              onClick={handleCollectionPickerContextMenu}
            >
              <ChevronDownIcon className="size-5 text-white" />
            </button>
          </p>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleSaveFilm}
            className={`bg-white text-neutral-800 rounded-full size-10 grid place-items-center cursor-pointer  ${isSaved ? "opacity-50" : ""}`}
          >
            {isSaved ? (
              <CheckIcon className="size-4" />
            ) : (
              <AddIcon className="size-4" />
            )}
          </button>
        </div>

        <p className="font-semibold p-2 text-base text-white line-clamp-3 self-end">
          {title}
        </p>
      </div>
    </div>
  );
}

export default FilmMeta;
