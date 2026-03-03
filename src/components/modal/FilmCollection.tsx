"use client";

import Button from "@/components/Button";
import CollectionSearchbar from "@/components/collection/CollectionSearchbar";
import SelectCollection from "@/components/collection/SelectionCollection";
import { useRecentlySavedFilmContext } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import useCollectionSelection from "@/hooks/useCollectionSelection";
import useFilmCollections from "@/hooks/useFilmCollections";
import useFilteredCollections from "@/hooks/useFilteredCollections";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "sonner";

function FilmCollection() {
  const [search, setSearch] = useState("");
  const [isSavingFilm, setIsSavingFilm] = useState(false);

  const {
    setCollectionLastSavedTo,
    setRecentlySavedFilm,
    removeRecentlySavedFilm,
  } = useRecentlySavedFilmContext();

  const {
    state: { modal },
    closeModal,
    stopPropagation,
  } = useModal();

  const isFCM = modal?.type === ModalEnum.FCM;
  const film = isFCM ? modal.payload?.film : null;
  const user = isFCM ? modal.payload?.user : null;

  // Get all the user's collections.
  const { collectionFilmsQuery, collectionsMetaQuery } = useFilmCollections({
    filmID: film?.id,
  });

  const originalIDs = useMemo(
    () => collectionFilmsQuery.data ?? [],
    [collectionFilmsQuery.data],
  );

  const { selectedIDs, changes, hasChanges, toggle } =
    useCollectionSelection(originalIDs);

  const { available, filled } = useFilteredCollections({
    collections: collectionsMetaQuery.data ?? [],
    targetCollectionIDs: collectionFilmsQuery.data ?? [],
    searchQuery: search,
  });

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }
  const queryClient = useQueryClient();

  //save the film to collections
  async function handleSubmit() {
    if (!film) return;

    setIsSavingFilm(true);

    // Optimistic UI update
    const collections = collectionsMetaQuery.data;
    const firstCollection = collections?.find((c) => c.id === changes.toAdd[0]);

    if (firstCollection) {
      setRecentlySavedFilm({
        filmID: film.id,
        collection: firstCollection.name,
        savedToCollectionCount: changes.toAdd.length,
      });

      setCollectionLastSavedTo({
        id: firstCollection.id,
        name: firstCollection.name,
      });
    }

    closeModal();

    try {
      await toast.promise(
        addFilmToCollection({
          film,
          newIDs: changes.toAdd,
          deletedIDs: changes.toRemove,
        }),
        {
          loading: "Updating your collections...",
          success: async () => {
            // Invalidate in background (no need to await)
            queryClient.invalidateQueries({
              queryKey: ["collection", "films", film.id],
              refetchType: "all",
            });

            queryClient.invalidateQueries({
              queryKey: ["films"],
              refetchType: "all",
            });

            queryClient.invalidateQueries({
              queryKey: ["collections", user?.username ?? ""],
            });

            return "Updated your collections.";
          },
          error: () => {
            // Rollback optimistic update
            removeRecentlySavedFilm(film.id);
            return "Failed to save film.";
          },
        },
      );
    } finally {
      setIsSavingFilm(false);
    }
  }

  return (
    <div
      className="relative p-0 rounded-3xl overflow-hidden h-110 w-76 bg-white "
      onClick={stopPropagation}
    >
      <div className="grid grid-rows-[110px_1fr_64px] h-full">
        <div className="flex flex-col gap-4 p-4 border-b border-gray-50 ">
          <p className="text-xs font-medium text-center">Add to Collection</p>
          <CollectionSearchbar
            search={search}
            onSearchChange={handleSearch}
            onClearSearch={clearSearch}
          />
        </div>

        <div className="flex flex-col gap-4 py-4 h-full overflow-y-scroll no-scrollbar ">
          <div className="flex flex-col gap-4">
            {filled.length > 0 && (
              <SelectCollection
                isLoading={collectionFilmsQuery.isLoading}
                collections={filled}
                selectCollection={toggle}
                selectedIDs={selectedIDs}
                sectionHeading="Saved in"
              />
            )}
          </div>

          {available.length > 0 && (
            <SelectCollection
              isLoading={collectionsMetaQuery.isLoading}
              collections={available}
              selectCollection={toggle}
              selectedIDs={selectedIDs}
              sectionHeading="Your collections"
            />
          )}
        </div>

        <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
          <Button onClick={closeModal}>Cancel</Button>

          {hasChanges ? (
            <Button
              type="submit"
              disabled={isSavingFilm || !hasChanges}
              onClick={handleSubmit}
              className="bg-neutral-800 text-white disabled:opacity-50"
            >
              {isSavingFilm ? "Saving..." : "Save"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default FilmCollection;
