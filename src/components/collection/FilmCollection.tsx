"use client";

import Button from "@/components/Button";
import SelectCollection from "@/components/collection/CollectionMeta";
import CollectionSearchbar from "@/components/collection/CollectionSearchbar";
import { LoadingIcon } from "@/components/icons";
import { useRecentlySavedFilmContext } from "@/context/RecentlySavedFilmContext";
import { useModal } from "@/context/useModal";
import useCollectionSelection from "@/hooks/useCollectionSelection";
import useFilmCollections from "@/hooks/useFilmCollections";
import useFilteredCollections from "@/hooks/useFilteredCollections";
import { ModalEnum } from "@/types/modal";
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

  // Get all the user's collections.
  const { collectionFilmsQuery, collectionsMetaQuery } = useFilmCollections({
    filmID: film?.id,
  });

  const originalIDs = useMemo(
    () => collectionFilmsQuery.data?.map((c) => c.id) ?? [],
    [collectionFilmsQuery.data],
  );

  const { selectedIDs, changes, hasChanges, toggle } =
    useCollectionSelection(originalIDs);

  const { available, saved } = useFilteredCollections({
    allCollections: collectionsMetaQuery.data ?? [],
    savedCollections: collectionFilmsQuery.data ?? [],
    searchQuery: search,
  });

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  //save the film to collections
  async function handleSubmit() {
    if (!film) return;

    setIsSavingFilm(true);
    try {
      // Show optimistic update
      const collections = collectionsMetaQuery.data;
      const firstCollection = collections?.find(
        (c) => c.id === changes.toAdd[0],
      );

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
      // Save in background
      const { error } = await addFilmToCollection({
        film,
        newIDs: changes.toAdd,
        deletedIDs: changes.toRemove,
      });

      if (error) throw error;

      toast("Updated your collections.");
      await collectionFilmsQuery.refetch();
    } catch (error) {
      console.log(error);
      removeRecentlySavedFilm(film.id);
      toast.error("Failed to save film.");
    } finally {
      setIsSavingFilm(false);
    }
  }

  const isLoadingFilmCollections =
    collectionFilmsQuery.isLoading || collectionFilmsQuery.isFetching;

  return (
    <div
      className="relative p-0 rounded-3xl overflow-hidden h-110 w-76 bg-white "
      onClick={stopPropagation}
    >
      {collectionsMetaQuery.isLoading && (
        <div className="h-full grid place-items-center">
          <LoadingIcon className="size-4 animate-spin" />
        </div>
      )}

      {!collectionsMetaQuery.isLoading && (
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
            {isLoadingFilmCollections ? (
              <div className="h-52 grid place-items-center">
                <LoadingIcon className="size-4 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {saved.length > 0 && (
                  <SelectCollection
                    collections={saved}
                    selectCollection={toggle}
                    selectedIDs={selectedIDs}
                    sectionHeading="Saved in"
                  />
                )}

                {available.length > 0 && (
                  <SelectCollection
                    collections={available}
                    selectCollection={toggle}
                    selectedIDs={selectedIDs}
                    sectionHeading="Your collections"
                  />
                )}
              </div>
            )}
          </div>
          <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
            <Button onClick={closeModal}>Cancel</Button>

            {search ? (
              <Button className="bg-neutral-800 text-white">
                Create Collection
              </Button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FilmCollection;
