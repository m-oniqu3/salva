"use client";

import Button from "@/components/Button";
import { LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { createCollection } from "@/server-actions/create-collection";
import { ModalEnum } from "@/types/modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
  NewCollection,
  NewCollectionSchema,
} from "@utils/validation/create-collection";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function CreateCollection() {
  const {
    stopPropagation,
    closeModal,
    state: { modal },
  } = useModal();
  const [isCreatingCollection, startCreateCollectionTransition] =
    useTransition();

  const collectionPayload =
    modal?.type === ModalEnum.CREATE_COLLECTION ? modal.payload : null;

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<NewCollection>({
    resolver: zodResolver(NewCollectionSchema),
    defaultValues: {
      name: collectionPayload?.collectionName ?? "",
      description: "",
      private: false,
    },
  });

  const { errors } = form.formState;

  function onSubmitForm(input: NewCollection) {
    startCreateCollectionTransition(async () => {
      try {
        const film = collectionPayload?.film;
        const { data, error } = await createCollection({
          collection: {
            name: input.name,
            description: input.description ?? "",
            isPrivate: input.private ? true : false,
          },
          film: film,
        });

        if (error) throw error;
        if (!data) throw new Error("Something went wrong");

        const {
          user: { username, user_id },
          collection: { slug, id: collectionID },
        } = data;

        const keys = [
          ["collections", user_id],
          ["collection", "meta"],
          // ["film", film?.id, "collections"],
        ];

        queryClient.setQueryData(
          ["film", film?.id, "collections"],
          (old: number[]) => [collectionID, ...(old ?? [])],
        );

        await Promise.all(
          keys.map((key) => queryClient.invalidateQueries({ queryKey: key })),
        );

        router.push("/" + username + "/" + slug);

        closeModal();

        toast("Collection created!");
      } catch (error) {
        console.log(error);

        if (
          (error as unknown as string).includes("Collection already exists")
        ) {
          form.setError("root", {
            message: "You already have a collection with this name.",
          });

          return;
        }

        toast("Something went wrong");
      }
    });
  }

  return (
    <div
      className="relative panel grid grid-rows-[auto_1fr] gap-4 w-76 h-110"
      onClick={stopPropagation}
    >
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium text-center">Create Collection</p>

        {collectionPayload?.film && (
          <p className="text-sml p-2 rounded-xl bg-red-700 text-white font-medium">
            Adding {collectionPayload.film.title}
          </p>
        )}

        {errors.root && (
          <p className="py-1 input-error">{errors.root.message}</p>
        )}
      </header>

      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmitForm)}
      >
        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="form-label ">
            Collection Name
          </label>

          <input
            {...form.register("name")}
            className="input h-9"
            placeholder="comfort rewatches"
          />

          <p className="input-error">{form.formState.errors.name?.message}</p>
        </div>

        {/* description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="form-label">
            Description (Optional)
          </label>

          <textarea
            {...form.register("description")}
            className="input h-20 resize-none"
            placeholder="movies i throw on when my brain is tired"
          ></textarea>

          <p className="input-error">
            {form.formState.errors.description?.message}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...form.register("private")}
            id="private"
            className="size-4 accent-black"
          />

          <label htmlFor="private" className="text-sml h-full mt-0!">
            Is this collection private?
          </label>

          <p className="input-error">
            {form.formState.errors.private?.message}
          </p>
        </div>

        <div className="h-16 w-full p-4 flex items-center justify-end gap-4 border-t border-gray-50 shadow-xs absolute bottom-0 left-0 bg-white z-10">
          <Button onClick={closeModal}>Cancel</Button>

          <Button
            disabled={isCreatingCollection}
            type="submit"
            className="bg-neutral-800 text-white "
          >
            {isCreatingCollection ? (
              <div className="flex items-center justify-center gap-2">
                Creating
                <span className="animate-spin text-white">
                  <LoadingIcon className="size-4" />
                </span>
              </div>
            ) : (
              "Create Collection"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateCollection;
