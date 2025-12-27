"use client ";

import Button from "@/components/Button";
import { AddIcon, CloseIcon, LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { findCollection } from "@utils/api/collections/find-collection";
import {
  EditedCollection,
  EditedCollectionSchema,
} from "@utils/validation/edit-collection";
import { usePathname } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";

function EditCollection() {
  const {
    state: { modal },
    openModal,
    closeModal,
    stopPropagation,
  } = useModal();

  const [isEditingCollection, startEditCollectionTransition] = useTransition();

  const pathname = usePathname();
  const [username, slug] = pathname.split("/").slice(1) as Array<string | null>;

  // const triggerFileInput = () => hiddenFileInputRef.current?.click();

  // Is EditCollection Modal ?
  const isECM = modal?.type === ModalEnum.ECM;
  const collectionSummary =
    isECM && modal.payload ? modal.payload.collectionSummary : null;

  const form = useForm<EditedCollection>({
    resolver: zodResolver(EditedCollectionSchema),
    defaultValues: {
      name: collectionSummary?.collection.name ?? "",
      description: collectionSummary?.collection.description ?? "",
    },
  });

  useEffect(() => {
    async function fetchCollection() {
      // let isMounted = true;

      try {
        if (!username || !slug) return;

        const { data, error } = await findCollection(username, slug);

        if (error) {
          throw new Error(error);
        }

        // if (!isMounted) return;

        if (!data || !data.collection) {
          // form.reset({ name: "", description: "" });
          form.reset();
          return;
        }

        const { name, description } = data.collection;

        form.reset({ name, description: description ?? "" });
      } catch (error: unknown) {
        form.setError("root", {
          type: "value",
          message: error instanceof Error ? error.message : String(error),
        });
      }

      // return () => {
      //   isMounted = false; // avoids state updates if component unmounts
      // };
    }

    fetchCollection();
  }, [form, username, slug]);

  function openImagePickerModal() {
    openModal({ type: ModalEnum.IPM });
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
    <div
      className="panel flex flex-col max-w-sm mx-auto"
      onClick={stopPropagation}
    >
      <header className="relative pb-10">
        <h1 className="text-lg font-semibold text-neutral-800">
          Edit Collection
        </h1>
        <p className="text-sml">Edit your collection.</p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>
      <form
        className="relative flex flex-col gap-4  h-full"
        onSubmit={form.handleSubmit(onSubmitForm)}
      >
        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml text-neutral-800">
            Collection Cover
          </label>

          <button
            type="button"
            onClick={openImagePickerModal}
            className="flex justify-center items-center size-24 rounded-lg gray z-0 cursor-pointer"
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
            className="input h-20 resize-none gray no-scrollbar"
            placeholder="movies i throw on when my brain is tired"
          ></textarea>

          <p className="input-error">
            {form.formState.errors.description?.message}
          </p>
        </div>

        <Button
          disabled={isEditingCollection}
          type="submit"
          className="bg-neutral-800 text-white rounded-lg h-9 mt-auto"
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
      </form>
    </div>
  );
}

export default EditCollection;
