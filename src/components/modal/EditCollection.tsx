"use client ";

import Button from "@/components/Button";
import {
  AddIcon,
  CameraIcon,
  CloseIcon,
  LoadingIcon,
} from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { editCollection } from "@utils/api/collections/edit-collection";
import { getCollectionCoverUrl, getTMDBImageURL } from "@utils/get-cover-url";
import {
  EditedCollection,
  EditedCollectionSchema,
} from "@utils/validation/edit-collection";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function EditCollection() {
  const {
    state: { modal },
    openModal,
    closeModal,
    stopPropagation,
  } = useModal();

  const [isEditingCollection, startEditCollectionTransition] = useTransition();
  const router = useRouter();

  // Is EditCollection Modal ?
  const isECM = modal?.type === ModalEnum.ECM;
  const collectionDetails = isECM ? modal.payload?.collectionDetails : null;

  const imageUrl =
    collectionDetails?.cover_type &&
    collectionDetails.cover_image &&
    collectionDetails?.cover_type === "uploaded"
      ? getCollectionCoverUrl(collectionDetails.cover_image)
      : collectionDetails?.cover_image
        ? getTMDBImageURL(collectionDetails.cover_image)
        : null;

  const url = collectionDetails?.cover_image ? imageUrl : null;

  const form = useForm<EditedCollection>({
    resolver: zodResolver(EditedCollectionSchema),
    defaultValues: {
      name: collectionDetails?.name ?? "",
      description: collectionDetails?.description ?? "",
    },
  });

  const { errors } = form.formState;
  const isError = !!errors.name || !!errors.description || !!errors.root;

  function openImagePickerModal() {
    if (!collectionDetails) return;

    openModal({
      type: ModalEnum.IPM,
      payload: { collectionDetails: collectionDetails },
    });
  }

  const queryClient = useQueryClient();
  function onSubmitForm(input: EditedCollection) {
    startEditCollectionTransition(async () => {
      try {
        if (!collectionDetails) return;

        const nameChanged = input.name?.trim() !== collectionDetails.name;

        const descriptionChanged =
          (input.description ?? "").trim() !==
          (collectionDetails.description ?? "");

        if (!nameChanged && !descriptionChanged) {
          form.setError("root", {
            message: "No changes were made.",
          });
          return;
        }

        const { data, error } = await editCollection({
          collection: {
            id: collectionDetails.id,
            ...(nameChanged && { name: input.name }),
            ...(descriptionChanged && {
              description: input.description ?? "",
            }),
          },
        });

        if (error) throw error;

        if (!data) throw new Error("Something went wrong.");

        const { slug, username } = data;
        router.replace("/" + username + "/" + slug);

        queryClient.invalidateQueries({
          queryKey: ["collections", username],
        });

        toast("Collection Updated ");
        closeModal();
      } catch (error) {
        console.log(error);
        form.setError("root", {
          message: "Could not update your collection.",
        });
      }
    });
  }

  return (
    <form
      className="panel flex flex-col gap-4 w-80 h-fit mx-auto"
      onClick={stopPropagation}
      onSubmit={form.handleSubmit(onSubmitForm)}
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

        {errors.root && (
          <p className="py-1 input-error">{errors.root.message}</p>
        )}
      </header>

      <div className="relative flex flex-col gap-4  h-full">
        {/* cover */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml text-neutral-800">
            Cover
          </label>

          {collectionDetails?.cover_image && url ? (
            <figure className="relative size-20">
              <div
                className="absolute absolute-center bg-white text-neutral-800 rounded-full size-10 grid place-items-center cursor-pointer z-10"
                onClick={openImagePickerModal}
              >
                <CameraIcon className="size-5" />
              </div>

              <Image
                src={url}
                alt={collectionDetails.name}
                width={90}
                height={90}
                className="object-cover size-full rounded-lg"
              />
            </figure>
          ) : (
            <button
              type="button"
              onClick={openImagePickerModal}
              className="flex justify-center items-center size-20 rounded-lg gray z-0 cursor-pointer"
            >
              <AddIcon className="size-5 text-neutral-400" />
            </button>
          )}
        </div>

        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml text-neutral-800">
            Name
          </label>

          <input
            {...form.register("name")}
            placeholder="comfort rewatches"
            className="input h-9 gray"
          />

          <p className="input-error">{errors.name?.message}</p>
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

          <p className="input-error">{errors.description?.message}</p>
        </div>

        <Button
          disabled={isEditingCollection || isError}
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
