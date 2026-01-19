"use client";

import Button from "@/components/Button";
import CollectionMeta from "@/components/collection/CollectionMeta";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getFilmCollections } from "@utils/api/collections/get-film-collections";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

const areSetsEqualArrow = (set1: Set<number>, set2: Set<number>) =>
  set1.size === set2.size && [...set1].every((value) => set2.has(value));

function CollectionPickerMenu() {
  const [search, setSearch] = useState("");
  const {
    state: { menu },
    closeContextMenu,
  } = useContextMenu();
  const qc = new QueryClient();

  // Is Collection Picker Menu? Get the film payload.
  const isCPM = menu?.type === ContextMenuEnum.CPM;
  const film = isCPM ? menu.payload?.film : undefined;

  const collectionsMetaQuery = useQuery({
    queryKey: ["collection", "meta", film?.id],
    queryFn: () => {
      if (!film?.id) throw new Error("No film ID.");
      return getCollectionsMeta(film?.id);
    },
  });

  const collectionFilmsQuery = useQuery({
    queryKey: ["collection", "films", film?.id],
    queryFn: () => {
      if (!film?.id) throw new Error("No film ID.");
      return getFilmCollections(film?.id);
    },
    enabled: !!film?.id,
  });

  const savedIDs = collectionFilmsQuery?.data?.data?.map((col) => col.id) ?? [];

  const [selectedIDs, setSelectedIDs] = useState<Set<number>>(
    new Set(savedIDs),
  );

  // When collection-films data is ready get the collection IDs
  useEffect(() => {
    if (collectionFilmsQuery.data?.data) {
      const savedIDs =
        collectionFilmsQuery.data?.data.map((col) => col.id) ?? [];
      setSelectedIDs(new Set(savedIDs));
    }
  }, [collectionFilmsQuery.data]);

  const [isSavingFilm, setIsSavingFilm] = useState(false);
  // const [isSaved, setIsSaved] = useState(false);

  const [areSelectionsEqual, setAreSelectionsEqual] = useState(
    areSetsEqualArrow(
      selectedIDs,
      new Set(collectionFilmsQuery.data?.data?.map((c) => c.id)),
    ),
  );

  useEffect(() => {
    setAreSelectionsEqual(
      areSetsEqualArrow(
        selectedIDs,
        new Set(collectionFilmsQuery.data?.data?.map((c) => c.id)),
      ),
    );
  }, [collectionFilmsQuery.data?.data, selectedIDs]);

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  function closeMenu() {
    closeContextMenu();
  }

  // Update the selected collection IDS
  function handleSelectedCollection(id: number) {
    // e.stopPropagation();

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

  async function handleSubmit() {
    if (!film) return;
    setIsSavingFilm(true);

    const originalIDs = new Set(
      collectionFilmsQuery.data?.data?.map((c) => c.id) ?? [],
    );

    const addedIDs = selectedIDs.difference(originalIDs);
    const deletedIDs = originalIDs.difference(selectedIDs);

    closeContextMenu();

    // add the film to the films table
    // add/delete the record(s) to/from the collection_films table
    const { data, error } = await addFilmToCollection({
      film,
      addedIDs: Array.from(addedIDs),
      deletedIDs: Array.from(deletedIDs),
    });

    if (data) {
      toast(`Updated your collections.`);

      // invalidate the query
      qc.invalidateQueries({
        queryKey: ["collection", "meta", film.id],
        refetchType: "all",
      });

      qc.invalidateQueries({
        queryKey: ["collection", "films", film.id],
        refetchType: "all",
      });
    }

    if (error) {
      // setIsSaved(false);
      toast("Failed to save film to your collection.");
    }

    setIsSavingFilm(false);
    // setSelectedIDs(new Set());
  }

  const rendered_available_collections = collectionsMetaQuery.data?.data?.map(
    (collection) => {
      return (
        <CollectionMeta
          key={collection.id}
          collection={collection}
          selectCollection={handleSelectedCollection}
          collectionIsSelected={selectedIDs.has(collection.id)}
        />
      );
    },
  );

  const rendered_saved_collections = collectionFilmsQuery.data?.data?.map(
    (collection) => {
      return (
        <CollectionMeta
          key={collection.id}
          collection={collection}
          selectCollection={handleSelectedCollection}
          collectionIsSelected={selectedIDs.has(collection.id)}
        />
      );
    },
  );

  return (
    <div
      className="context-panel overflow-hidden h-110 bg-white min-[400px]:w-76 border border-gray-100 p-0 relative z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="grid grid-rows-[110px_1fr_64px] h-full">
        <div className="flex flex-col gap-4 p-4 border-b border-gray-50 ">
          <p className="text-xs font-medium text-center">Add to Collection</p>

          <form className="grid grid-cols-[30px_auto_30px] ">
            <div className="gray pl-4 flex-center rounded-l-2xl">
              <SearchIcon className="size-4 text-neutral-400" />
            </div>

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              className="gray w-full text-sml h-[48px] px-4 font-medium focus:outline-none placeholder:text-neutral-500"
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

        <div className="flex flex-col gap-4 py-4 h-full overflow-y-scroll no-scrollbar ">
          {!!rendered_saved_collections?.length && (
            <div className="flex flex-col">
              <p className="text-sml font-medium px-4">Saved in</p>
              <ul className="flex flex-col h-full p-2 ">
                {rendered_saved_collections}
              </ul>
            </div>
          )}

          {rendered_available_collections && (
            <div className="flex flex-col">
              <p className="text-sml font-medium px-4">Your collections</p>
              <ul className="flex flex-col h-full p-2 ">
                {rendered_available_collections}
              </ul>
            </div>
          )}
        </div>

        <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
          <Button onClick={closeMenu}>Cancel</Button>

          {search ? (
            <Button className="bg-neutral-800 text-white">
              Create Collection
            </Button>
          ) : (
            <>
              {!areSelectionsEqual ? (
                <Button
                  type="submit"
                  disabled={isSavingFilm}
                  onClick={handleSubmit}
                  className="bg-neutral-800 text-white"
                >
                  Save
                </Button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionPickerMenu;

// {
//   isLoading && (
//     <div className="h-full grid place-items-center">
//       <LoadingIcon className="size-4.5 animate-spin" />
//     </div>
//   );
// }

// {
//   (!result?.data?.collections || result.error) && (
//     <div className="h-full flex flex-col items-center justify-center gap-1">
//       <h1 className="text-lg font-semibold">Intermission</h1>
//       <p className="text-sml">
//         We couldn’t roll your collections. Try again.
//       </p>
//       <Button className="bg-neutral-800 text-white" onClick={refetch}>
//         {isRefetching ? (
//           <LoadingIcon className="size-4 animate-spin" />
//         ) : (
//           "Retry"
//         )}
//       </Button>
//     </div>
//   );
// }
