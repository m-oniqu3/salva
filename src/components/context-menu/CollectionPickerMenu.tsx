"use client";

import Button from "@/components/Button";
import { CloseIcon, LoadingIcon, SearchIcon } from "@/components/icons";
import { useContextMenu } from "@/context/useContextMenu";
import useGetCollectionsMeta from "@/hooks/useGetCollectionsMeta";
import { ContextMenuEnum } from "@/types/context-menu";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

function CollectionPickerMenu() {
  const [search, setSearch] = useState("");
  const {
    state: { menu },
  } = useContextMenu();

  const isCPM = menu?.type === ContextMenuEnum.CPM;
  const userID = isCPM ? menu.payload?.userID : undefined;

  const { isLoading, data: recenlyUpdatedCollections } = useGetCollectionsMeta({
    userID,
  });

  const rendered_recently_updated_collections = recenlyUpdatedCollections?.data
    ? recenlyUpdatedCollections.data.map((collection) => {
        return (
          <li
            key={collection.id}
            className="grid place-items-center grid-cols-[50px_auto_20px] gap-4 "
          >
            {collection.cover_image ? (
              <figure>
                <Image
                  src={collection.cover_image}
                  alt={collection.name}
                  width={40}
                  height={40}
                />
              </figure>
            ) : (
              <div className="size-12 gray rounded-xl" />
            )}

            <div className="w-full">
              <p className="text-sml line-clamp-1 text-neutral-800 font-medium">
                {collection.name}
              </p>
              <p className="text-sml text-zinc-500">
                {collection.filmCount} films
              </p>
            </div>

            <input type="radio" value={collection.id} className="" />
          </li>
        );
      })
    : null;

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  return (
    <div className="context-panel overflow-hidden h-110 bg-white min-[400px]:w-80 border border-gray-100 p-0 relative">
      {isLoading && (
        <div className="h-full grid place-items-center">
          <LoadingIcon className="size-4.5 animate-spin" />
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex flex-col gap-2 h-28 p-4 border-b border-gray-50 ">
            <p className="text-sml font-medium">Add to Collection</p>

            <form className="grid grid-cols-[30px_auto_30px] ">
              <div className="gray pl-4 flex-center rounded-l-2xl">
                <SearchIcon className="size-4 text-neutral-400" />
              </div>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="gray w-full text-sml h-[50px] px-4 font-medium focus:outline-none placeholder:text-neutral-500"
                placeholder="Search..."
              />

              <button
                className="gray pr-4 flex-center rounded-r-2xl"
                onClick={clearSearch}
              >
                {search && <CloseIcon className="size-4.5 text-neutral-400" />}
              </button>
            </form>
          </div>

          <div className="h-full p-4 overflow-scroll no-scrollbar ">
            <div className="">
              <div>
                <p className="text-sml">Saved in</p>
              </div>

              {rendered_recently_updated_collections && (
                <div className="flex flex-col gap-2">
                  <p className="text-sml">Recently Updated</p>

                  <ul className="flex flex-col gap-4">
                    {rendered_recently_updated_collections}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
            <Button>Cancel</Button>

            {search ? (
              <Button className="bg-neutral-800 text-white">
                Create Collection
              </Button>
            ) : (
              <Button className="bg-neutral-800 text-white">Done</Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CollectionPickerMenu;
