"use client ";

import Button from "@/components/Button";
import { AddIcon, CloseIcon, LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditedCollection,
  EditedCollectionSchema,
} from "@utils/validation/edit-collection";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

function EditCollection() {
  const {
    state: { modal },
    openModal,
    closeModal,
    stopPropagation,
  } = useModal();

  const [isEditingCollection, startEditCollectionTransition] = useTransition();

  // const triggerFileInput = () => hiddenFileInputRef.current?.click();

  // Is EditCollection Modal ?
  const isECM = modal?.type === ModalEnum.ECM;
  const collectionDetails = isECM ? modal.payload?.collectionDetails : null;

  // const { data } = useFindCollection(username, slug);

  const form = useForm<EditedCollection>({
    resolver: zodResolver(EditedCollectionSchema),
    defaultValues: {
      name: collectionDetails?.name ?? "",
      description: collectionDetails?.description ?? "",
    },
  });

  function openImagePickerModal() {
    if (!collectionDetails) return;

    openModal({
      type: ModalEnum.IPM,
      payload: {
        collectionDetails: collectionDetails,
      },
    });
  }

  function onSubmitForm(input: EditedCollection) {
    startEditCollectionTransition(async () => {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description || "");

      console.log(formData);
    });
  }

  return (
    <form
      className="panel flex flex-col gap-4 w-80 h-115 mx-auto"
      onClick={stopPropagation}
    >
      <header className="relative">
        <h1 className="text-base font-bold text-neutral-800">
          Edit Collection
        </h1>
        <p className="text-sml">Adjust the details of your collection.</p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="size-4" />
        </button>
      </header>

      <div
        className="relative flex flex-col gap-2  h-full"
        onSubmit={form.handleSubmit(onSubmitForm)}
      >
        {/* cover */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml text-neutral-800">
            Collection Cover
          </label>

          <button
            type="button"
            onClick={openImagePickerModal}
            className="flex justify-center items-center size-20 rounded-lg gray z-0 cursor-pointer"
          >
            <AddIcon className="size-5 text-neutral-400" />
          </button>

          <p className="input-error"></p>
        </div>

        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml text-neutral-800">
            Collection Name
          </label>

          <input
            {...form.register("name")}
            placeholder="comfort rewatches"
            className="input h-9 gray"
          />

          <p className="input-error"></p>
        </div>

        {/* description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sml text-neutral-800">
            What is this collection about?
          </label>

          <textarea
            {...form.register("description")}
            className="input h-16 resize-none gray no-scrollbar"
            placeholder="movies i throw on when my brain is tired"
          ></textarea>

          <p className="input-error">
            {form.formState.errors.description?.message}
          </p>
        </div>

        <Button
          disabled={isEditingCollection}
          type="submit"
          className="bg-neutral-800 text-white rounded-lg h-9"
        >
          {isEditingCollection ? (
            <div className="flex items-center justify-center gap-2">
              <span className="animate-spin text-white">
                <LoadingIcon className="size-5" />
              </span>
            </div>
          ) : (
            "Edit Collection"
          )}
        </Button>
      </div>
    </form>
  );
}

export default EditCollection;
