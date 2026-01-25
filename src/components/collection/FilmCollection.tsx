"use client";

import Button from "@/components/Button";
import CollectionMeta from "@/components/collection/CollectionMeta";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { addFilmToCollection } from "@utils/api/collections/add-film-to-collection";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getFilmCollections } from "@utils/api/collections/get-film-collections";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function FilmCollection() {
  const [search, setSearch] = useState("");
  const [hasSelectionChanged, setHasSelectionsChanged] = useState(false);

  const [isFilmSaved, setIsFilmSaved] = useState(false);
  const [savedIDs, setSavedIDs] = useState<Set<number>>(new Set());
  const [newIDs, setNewIDs] = useState<Set<number>>(new Set());
  const [deletedIDs, setDeletedIDs] = useState<Set<number>>(new Set());
  const [isSavingFilm, setIsSavingFilm] = useState(false);
  const originalSavedIDs = useRef<number[]>([]);

  const {
    state: { modal },
    closeModal,
    stopPropagation,
  } = useModal();
  const qc = new QueryClient();

  const isFCM = modal?.type === ModalEnum.FCM;
  const film = isFCM ? modal.payload?.film : null;

  // Get all the user's collections.
  const collectionsMetaQuery = useQuery({
    queryKey: ["collection", "meta"],
    queryFn: () => getCollectionsMeta(),
  });

  //Get the collections the film is saved in
  const collectionFilmsQuery = useQuery({
    queryKey: ["collection", "films", film?.id],
    queryFn: () => {
      if (!film?.id) throw new Error("No film ID.");
      return getFilmCollections(film?.id);
    },
    enabled: !!film?.id,
  });

  // When collection-films data is ready get the collection IDs
  useEffect(() => {
    if (collectionFilmsQuery.data?.data) {
      const savedIDs =
        collectionFilmsQuery.data?.data.map((col) => col.id) ?? [];

      setSavedIDs(new Set(savedIDs));
      originalSavedIDs.current = savedIDs;
    }
  }, [collectionFilmsQuery.data]);

  // Update the selected collection IDS
  function handleSavedCollections(id: number) {
    setSavedIDs((prevSaved) => {
      const saved = new Set(prevSaved);

      if (saved.has(id)) {
        // remove from saved
        saved.delete(id);

        // mark for deletion
        setDeletedIDs((prevDeleted) => {
          const deleted = new Set(prevDeleted);
          deleted.add(id);
          return deleted;
        });
      } else {
        // restore to saved
        saved.add(id);

        // undo deletion
        setDeletedIDs((prevDeleted) => {
          const deleted = new Set(prevDeleted);
          deleted.delete(id);
          return deleted;
        });
      }

      return saved;
    });
  }

  function handleAvailableCollections(id: number) {
    setNewIDs((prev) => {
      const copy = new Set(prev);

      if (!copy.has(id)) {
        copy.add(id);
      } else {
        copy.delete(id);
      }

      return copy;
    });
  }

  useEffect(() => {
    setHasSelectionsChanged(() => {
      if (
        newIDs.size > 0 ||
        deletedIDs.size > 0 ||
        originalSavedIDs.current.length !== savedIDs.size
      )
        return true;
      return false;
    });
  }, [newIDs, deletedIDs, savedIDs]);

  // filter saved collections
  const available_collections =
    collectionsMetaQuery.data?.data?.filter((col) => {
      return !savedIDs.has(col.id);
    }) ?? [];

  const rendered_available_collections = available_collections.map(
    (collection) => {
      return (
        <CollectionMeta
          key={collection.id}
          collection={collection}
          selectCollection={handleAvailableCollections}
          collectionIsSelected={newIDs.has(collection.id)}
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
          selectCollection={handleSavedCollections}
          collectionIsSelected={savedIDs.has(collection.id)}
        />
      );
    },
  );

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  //Save the film to collections
  async function handleSubmit() {
    if (!film) return;

    setIsSavingFilm(true);
    setIsFilmSaved(true);
    closeModal();

    const filmCollectionData = {
      film,
      newIDs: [...newIDs],
      deletedIDs: [...deletedIDs],
    };
    const { data, error } = await addFilmToCollection(filmCollectionData);

    if (data) {
      toast(`Updated your collections.`);

      qc.invalidateQueries({
        queryKey: ["collection", "films", film.id],
      });
    }

    if (error) {
      setIsFilmSaved(false);
      toast("Failed to save film to your collection.");
    }

    setIsSavingFilm(false);
    setNewIDs(new Set());
    setDeletedIDs(new Set());
    setSavedIDs(new Set());
  }

  return (
    <div
      className="relative p-0 rounded-3xl overflow-hidden h-110 w-76 bg-white "
      onClick={stopPropagation}
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
              onClick={() => setSearch("")}
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
          <Button onClick={closeModal}>Cancel</Button>

          {search ? (
            <Button className="bg-neutral-800 text-white">
              Create Collection
            </Button>
          ) : (
            <>
              {hasSelectionChanged ? (
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

export default FilmCollection;
