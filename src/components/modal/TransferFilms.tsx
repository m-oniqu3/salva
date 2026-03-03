/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { transferFilms } from "@utils/api/films/transfer-films";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

function TransferFilms() {
  const { collectionsMetaQuery } = useFilmCollections();
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();

  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isSavingSelections, setIsSavingSelections] = useState(false);

  const isMCF = modal?.type === ModalEnum.TRANSFER_FILMS;
  const isCopyAction = isMCF && modal?.payload?.type === "copy" ? true : false;
  const sourceCollection = isMCF ? modal?.payload?.sourceCollectionID : null;

  const {
    selectedIDs: selectedCollectionIDs,
    clearSelection: clearCollectionSelection,
    hasChanges,
    toggle,
  } = useCollectionSelection();

  // the goal is to filter out the source collections so users cant move or copy films to that colleciton
  const { available: collections } = useFilteredCollections({
    allCollections: collectionsMetaQuery.data ?? [],
    // savedCollections: [sourceCollection]
    searchQuery: search,
  });

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function clearSearch() {
    setSearch("");
  }

  type MoveFilmsProps = {
    selectedCollectionIDs: number[];
    selectedFilmIDs: number[];
    selectedIDs: number[];
    sourceCollectionID: number;
    clearFilmSelection: () => void;
  };

  // Move films
  async function moveFilms(props: MoveFilmsProps) {
    const {
      clearFilmSelection,
      selectedCollectionIDs,
      selectedFilmIDs,
      selectedIDs,
      sourceCollectionID,
    } = props;

    setIsSavingSelections(true);

    toast.promise(
      async function () {
        queryClient.setQueryData(
          ["films", sourceCollectionID],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any[]) =>
                page.filter((film) => !selectedIDs.includes(film.id)),
              ),
            };
          },
        );
        clearFilmSelection();
        clearCollectionSelection();
        closeModal();

        const { error } = await transferFilms({
          action: "move",
          cf_ids: selectedIDs,
          sourceCollectionID,
          targetCollectionIDs: Array.from(selectedCollectionIDs),
          filmIDs: selectedFilmIDs,
        });

        if (error) throw error;
      },
      {
        loading: "Hang tight while we move your films",
        success: async () => {
          setIsSavingSelections(false);

          // Currently viewed collection
          queryClient.invalidateQueries({
            queryKey: ["films", sourceCollectionID],
          });
          // Collection(s) the films got moved to
          selectedCollectionIDs.map((colID) => {
            queryClient.invalidateQueries({
              queryKey: ["films", colID],
            });
          });

          return "Moved your films.";
        },
        error: "Something went wrong. Could not move your films.",
      },
    );
  }

  type CopyFilmsProps = {
    selectedCollectionIDs: number[];
    selectedFilmIDs: number[];
    clearFilmSelection: () => void;
  };

  async function copyFilms(props: CopyFilmsProps) {
    const { selectedCollectionIDs, selectedFilmIDs, clearFilmSelection } =
      props;

    setIsSavingSelections(true);

    try {
      toast.promise(
        async () => {
          clearFilmSelection();
          clearCollectionSelection();
          closeModal();

          const { error } = await transferFilms({
            action: "copy",
            targetCollectionIDs: Array.from(selectedCollectionIDs),
            filmIDs: selectedFilmIDs,
          });

          if (error) throw error;
        },

        {
          loading: "Hang tight while we copy your films",
          success: async () => {
            selectedCollectionIDs.map((colID) =>
              queryClient.invalidateQueries({
                queryKey: ["films", colID],
              }),
            );

            return "Copied your films.";
          },
          error: "Something went wrong. Could not copy your films.",
        },
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsSavingSelections(false);
    }
  }

  function handleSubmit() {
    const isMCF = modal?.type === ModalEnum.TRANSFER_FILMS;
    const payload = isMCF ? modal?.payload : null;

    if (!payload || !selectedCollectionIDs) return;

    const { type } = payload;

    if (type === "copy") {
      copyFilms({
        selectedCollectionIDs: Array.from(selectedCollectionIDs),
        ...payload,
        clearFilmSelection: payload.clearSelection,
      });
    } else {
      moveFilms({
        selectedCollectionIDs: Array.from(selectedCollectionIDs),
        ...payload,
        clearFilmSelection: payload.clearSelection,
      });
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
              {isCopyAction ? " Copy" : "Move"} Films
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

export default TransferFilms;
