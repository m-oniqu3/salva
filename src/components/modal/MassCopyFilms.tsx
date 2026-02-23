import Button from "@/components/Button";
import SelectCollection from "@/components/collection/CollectionMeta";
import CollectionSearchbar from "@/components/collection/CollectionSearchbar";
import { LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import useCollectionSelection from "@/hooks/useCollectionSelection";
import useFilmCollections from "@/hooks/useFilmCollections";
import useFilteredCollections from "@/hooks/useFilteredCollections";
import { ModalEnum } from "@/types/modal";
import { ChangeEvent, useState } from "react";

function MassCopyFilms() {
  const { collectionsMetaQuery } = useFilmCollections();
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();

  const [search, setSearch] = useState("");
  const [isSavingSelections, setIsSavingSelections] = useState(false);

  const {
    selectedIDs: selectedCollectionIDs,
    changes,
    hasChanges,
    toggle,
  } = useCollectionSelection();

  const { available } = useFilteredCollections({
    allCollections: collectionsMetaQuery.data ?? [],
    searchQuery: search,
  });

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  function handleSubmit() {
    const isMCF = modal?.type === ModalEnum.MCF;
    const selectdFilmIDs = isMCF ? modal.payload?.selectedFilmIDs : new Set([]);

    if (!selectdFilmIDs || !selectedCollectionIDs) return;

    console.log(selectdFilmIDs, selectedCollectionIDs);
  }

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
            <p className="text-xs font-medium text-center">
              Copy Films to Collection
            </p>
            <CollectionSearchbar
              search={search}
              onSearchChange={handleSearch}
              onClearSearch={clearSearch}
            />
          </div>

          <div className="flex flex-col gap-4 py-4 h-full overflow-y-scroll no-scrollbar ">
            {available.length > 0 && (
              <SelectCollection
                collections={available}
                selectCollection={toggle}
                selectedIDs={selectedCollectionIDs}
                sectionHeading="Your collections"
              />
            )}
          </div>
        </div>
      )}

      <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
        <Button onClick={closeModal}>Cancel</Button>

        {hasChanges ? (
          <Button
            type="submit"
            disabled={isSavingSelections || !hasChanges}
            onClick={handleSubmit}
            className="bg-neutral-800 text-white disabled:opacity-50"
          >
            {isSavingSelections ? "Saving..." : "Save"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default MassCopyFilms;
