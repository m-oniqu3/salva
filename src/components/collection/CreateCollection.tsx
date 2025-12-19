"use client";

import Button from "@/components/Button";
import { CloseIcon, LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { createCollection } from "@/server-actions/create-collection";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  NewCollection,
  NewCollectionSchema,
} from "@utils/validation/create-collection";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Props = {
  closeModal: () => void;
};

function CreateCollection(props: Props) {
  const { closeModal } = props;
  const { stopPropagation } = useModal();
  const [isCreatingCollection, startCreateCollectionTransition] =
    useTransition();

  const form = useForm<NewCollection>({
    resolver: zodResolver(NewCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
      private: false,
    },
  });

  function onSubmitForm(input: NewCollection) {
    startCreateCollectionTransition(async () => {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description || "");
      formData.append("private", input.private as unknown as string);

      console.log(input.private);
      console.log(formData);

      const { data, error } = await createCollection(formData);

      if (error) {
        console.log(error);
      }

      if (data) {
        console.log(data);
      }

      closeModal();
    });
  }

  return (
    <div className="panel flex flex-col max-w-sm" onClick={stopPropagation}>
      <header className="relative  pb-12">
        <h1 className="text-lg font-semibold">Create Collection</h1>
        <p className="text-sml">Create a collection to organize your films.</p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <form
        className="relative flex flex-col gap-4 h-full"
        onSubmit={form.handleSubmit(onSubmitForm)}
      >
        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml ">
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
          <label htmlFor="description" className="text-sml">
            What is this collection about?
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

        <div className="absolute bottom-0 w-full">
          <Button
            disabled={isCreatingCollection}
            type="submit"
            className="bg-neutral-800 text-white rounded-lg w-full h-9"
          >
            {isCreatingCollection ? (
              <div className="flex items-center justify-center gap-2">
                <span className="animate-spin text-white">
                  <LoadingIcon className="size-5" />
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
