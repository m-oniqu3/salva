/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/Button";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";
import { massDeleteFilms } from "@utils/api/films/mass-delete-films";
import { useState } from "react";
import { toast } from "sonner";

function MassDeleteFilms() {
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();

  const queryClient = useQueryClient();
  const [isDeletingFilms, setIsDeletingFilms] = useState(false);

  function handleDeleteFilms() {
    try {
      setIsDeletingFilms(true);

      const isMDF = modal?.type === ModalEnum.MDF;
      const payload = isMDF ? modal.payload : null;

      if (!payload) return;

      const {
        selectedFilmIDs,
        collectionID,
        clearSelection: clearFilmSelection,
      } = payload;

      toast.promise(
        async () => {
          queryClient.setQueryData(["films", collectionID], (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any[]) =>
                page.filter((film) => !selectedFilmIDs.includes(film.id)),
              ),
            };
          });

          closeModal();
          clearFilmSelection();

          const { error } = await massDeleteFilms({
            savedIDs: selectedFilmIDs,
            collectionID,
          });

          if (error) throw error;
        },

        {
          loading: "Hang tight while we handle this",
          success: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["films", collectionID],
            });

            return "Removed films.";
          },
          error: "Something went wrong.",
        },
      );
    } finally {
      setIsDeletingFilms(false);
    }
  }

  return (
    <div
      className="relative p-0 rounded-3xl overflow-hidden h-40 w-76 bg-white "
      onClick={stopPropagation}
    >
      <div className="p-4">
        <h1 className="text-base font-bold text-center">Delete Films</h1>

        <p className="text-sml">Are you sure you want to remove these films?</p>
      </div>

      <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
        <Button onClick={closeModal}>Cancel</Button>

        <Button
          disabled={isDeletingFilms}
          onClick={handleDeleteFilms}
          className="bg-red-700 text-white disabled:opacity-50"
        >
          {isDeletingFilms ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export default MassDeleteFilms;
