import Button from "@/components/Button";
import SelectCollection from "@/components/collection/CollectionMeta";
import CollectionSearchbar from "@/components/collection/CollectionSearchbar";
import { LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import useCollectionSelection from "@/hooks/useCollectionSelection";
import useFilmCollections from "@/hooks/useFilmCollections";
import useFilteredCollections from "@/hooks/useFilteredCollections";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";
import { massCopyFilms } from "@utils/api/films/mass-copy-films";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

function MassCopyFilms() {
  const { collectionsMetaQuery } = useFilmCollections();
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();

  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isSavingSelections, setIsSavingSelections] = useState(false);

  const {
    selectedIDs: selectedCollectionIDs,
    hasChanges,
    toggle,
  } = useCollectionSelection();

  const { available: collections } = useFilteredCollections({
    allCollections: collectionsMetaQuery.data ?? [],
    searchQuery: search,
  });

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  async function handleSubmit() {
    setIsSavingSelections(true);
    const isMCF = modal?.type === ModalEnum.MCF;
    const selectedFilmIDs = isMCF ? modal.payload?.selectedFilmIDs : null;

    if (!selectedFilmIDs || !selectedCollectionIDs) return;

    try {
      toast.promise(
        async () => {
          const { error } = await massCopyFilms({
            collectionIDs: Array.from(selectedCollectionIDs),
            filmIDs: selectedFilmIDs,
          });

          if (error) throw error;
        },

        {
          loading: "hang tight while we copy your films",
          success: () => {
            selectedCollectionIDs.forEach((colID) => {
              queryClient.invalidateQueries({
                queryKey: ["films", colID],
              });
            });

            return "Copied your films.";
          },
          error: "Something went wrong. Could not copy your films.",
        },
      );

      closeModal();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSavingSelections(false);
    }
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
            {collections.length > 0 ? (
              <SelectCollection
                collections={collections}
                selectCollection={toggle}
                selectedIDs={selectedCollectionIDs}
                sectionHeading="Your collections"
              />
            ) : (
              <p className="absolute-center">empty</p>
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
