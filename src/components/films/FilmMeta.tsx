"use client";

import { AddIcon, ChevronDownIcon } from "@/components/icons";
import { useContextMenu } from "@/context/useContextMenu";
import useClientRect from "@/hooks/useClientRect";
import { CollectionMeta } from "@/types/collection";
import { ContextMenuEnum } from "@/types/context-menu";
import { TMDBFilm } from "@/types/tmdb";
import { MouseEvent, useEffect } from "react";

type Props = {
  collectionMeta: CollectionMeta | null;
  film: TMDBFilm;
  userID: string;
};

function FilmMeta(props: Props) {
  const {
    film: { title },
    collectionMeta,
    userID,
  } = props;

  const { openContextMenu, closeContextMenu } = useContextMenu();
  const { ref: filmRef, rect } = useClientRect<HTMLButtonElement>();

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

    openContextMenu({
      type: ContextMenuEnum.CPM,
      position: { top: top + 20, left },
      payload: {
        userID,
      },
    });
  }

  useEffect(() => {
    window.addEventListener("resize", closeContextMenu);

    return () => {
      window.removeEventListener("resize", closeContextMenu);
    };
  }, [closeContextMenu]);

  return (
    <div className="absolute inset-0 bg-neutral-700/40 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute top-0 left-0 w-full h-full p-3 grid grid-rows-[auto_1fr] opacity-0 group-hover:opacity-100 xs:p-4">
        <div className="flex items-center justify-between gap-2">
          <p className=" flex items-center gap-1">
            <span className="flex-center px-2 text-base font-semibold text-white line-clamp-1">
              {collectionMeta ? collectionMeta.name : "..."}
            </span>

            <button
              ref={filmRef}
              className="flex-center cursor-pointer w-fit"
              onClick={handleCollectionPickerContextMenu}
            >
              <ChevronDownIcon className="size-5 text-white" />
            </button>
          </p>

          <button className="bg-white text-neutral-800 rounded-full size-8 grid place-items-center cursor-pointer xs:size-12">
            <AddIcon className="size-4 xs:size-5" />
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
