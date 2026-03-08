import Button from "@/components/Button";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";
import { deleteCollection } from "@utils/api/collections/delete-collection";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function DeleteCollection() {
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();

  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeletingFilms, setIsDeletingFilms] = useState(false);

  function handleDeleteCollection() {
    const collectionSummary =
      modal?.type === ModalEnum.DELETE_COLLECTION
        ? modal.payload?.summary
        : null;

    if (!collectionSummary) return;
    setIsDeletingFilms(true);

    deleteCollection({
      collection: { id: collectionSummary.collection.id },
    })
      .then((result) => {
        closeModal();
        const { error } = result;
        if (error) throw error;

        toast("Collection deleted");
        router.replace("/" + collectionSummary.user.username);

        queryClient.invalidateQueries({
          queryKey: ["collections", collectionSummary.user.user_id],
        });
      })
      .catch((error) => {
        console.log(error);

        toast("Failed to delete collection");
      })
      .finally(() => setIsDeletingFilms(false));
  }

  return (
    <div
      className="panel relative p-0 rounded-3xl overflow-hidden h-50 w-76 bg-white "
      onClick={stopPropagation}
    >
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-xs font-medium text-center">Delete Collection</h1>

        <p className="text-sml text-center">
          {
            "Are you sure you want to remove this collection? Your collection's films will also be deleted."
          }
        </p>
      </div>

      <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
        <Button onClick={closeModal}>Cancel</Button>

        <Button
          disabled={isDeletingFilms}
          onClick={handleDeleteCollection}
          className="bg-red-700 text-white disabled:opacity-50"
        >
          {isDeletingFilms ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

export default DeleteCollection;
