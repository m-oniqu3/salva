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
    closeContextMenu,
  } = useContextMenu();

  const isCPM = menu?.type === ContextMenuEnum.CPM;
  const payload = isCPM ? menu.payload : undefined;

  const {
    isLoading,
    data: result,
    refetch,
    isRefetching,
  } = useGetCollectionsMeta({
    userID: payload?.userID,
    filmID: payload?.filmID,
  });

  const [selectedIDs, setSelectedIDs] = useState<Set<number>>(
    result?.data?.in ?? new Set(),
  );

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  function closeMenu() {
    closeContextMenu();
  }

  function handleSelectedCollection(id: number) {
    setSelectedIDs((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  const rendered_collections = result?.data?.collections
    ? result.data.collections.map((collection) => {
        return (
          <li
            key={collection.id}
            onClick={() => handleSelectedCollection(collection.id)}
            className="grid place-items-center grid-cols-[50px_auto_40px] p-2 gap-4 rounded-2xl transition-all duration-300 ease-in-out cursor-pointer hover:gray"
          >
            {collection.cover_image ? (
              <figure>
                <Image
                  src={collection.cover_image}
                  alt={collection.name}
                  width={40}
                  height={40}
                  className="size-12 object-cover bg-neutral-200 rounded-xl"
                />
              </figure>
            ) : (
              <div className="size-12 bg-neutral-200 rounded-xl" />
            )}

            <div className="w-full">
              <p className="text-sml line-clamp-1 text-neutral-800 font-medium">
                {collection.name}
              </p>
              <p className="text-sml text-zinc-500">
                {collection.filmCount} films
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectedCollection(collection.id)}
              className={`size-3.5  border border-neutral-800 rounded-full cursor-pointer ${selectedIDs.has(collection.id) ? "bg-neutral-800" : ""}`}
            />
          </li>
        );
      })
    : null;

  return (
    <div
      className="context-panel overflow-hidden h-110 bg-white min-[400px]:w-80 border border-gray-100 p-0 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {isLoading && (
        <div className="h-full grid place-items-center">
          <LoadingIcon className="size-4.5 animate-spin" />
        </div>
      )}

      {(!result?.data?.collections || result.error) && (
        <div className="h-full flex flex-col items-center justify-center gap-1">
          <h1 className="text-lg font-semibold">Intermission</h1>
          <p className="text-sml">
            We couldn’t roll your collections. Try again.
          </p>
          <Button className="bg-neutral-800 text-white" onClick={refetch}>
            {isRefetching ? (
              <LoadingIcon className="size-4 animate-spin" />
            ) : (
              "Retry"
            )}
          </Button>
        </div>
      )}

      {result?.data?.collections && (
        <div className="grid grid-rows-[115px_1fr_64px] h-full">
          <div className="flex flex-col gap-4 h-28 p-4 border-b border-gray-50 ">
            <p className="text-xs font-medium text-center">Add to Collection</p>

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
                type="button"
                className="gray pr-4 flex-center rounded-r-2xl cursor-pointer"
                onClick={clearSearch}
              >
                {search && <CloseIcon className="size-4.5 text-neutral-400" />}
              </button>
            </form>
          </div>

          {rendered_collections && (
            <ul className="flex flex-col h-full p-2 overflow-scroll no-scrollbar">
              {rendered_collections}
            </ul>
          )}

          <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
            <Button onClick={closeMenu}>Cancel</Button>

            {search ? (
              <Button className="bg-neutral-800 text-white">
                Create Collection
              </Button>
            ) : (
              <Button className="bg-neutral-800 text-white">Done</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CollectionPickerMenu;
