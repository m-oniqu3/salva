"use client";

import Button from "@/components/Button";
import { CloseIcon, LoadingIcon } from "@/components/icons";
import { CreateCollectionSchema } from "@/utils/validation/CreateCollection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Props = {
  closeModal: () => void;
};

function CreateCollection(props: Props) {
  const { closeModal } = props;
  const [isCreatingCollection, startCreateCollectionTransition] =
    useTransition();

  const form = useForm<CreateCollectionSchema>({
    resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      name: "",
      description: "",
      private: false,
    },
  });

  function onSubmitForm(input: CreateCollectionSchema) {
    startCreateCollectionTransition(async () => {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description || "");
      formData.append("private", input.private ? "true" : "false");

      await delay(500);
      console.log(formData);
    });
  }

  return (
    <div className="container max-w-sm">
      <header className="relative pb-8 ">
        <h1 className="text-lg font-semibold">Create Collection</h1>
        <p className=" font-light text-sm">
          Create a collection to organize your films.
        </p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </header>

      <form className="" onSubmit={form.handleSubmit(onSubmitForm)}>
        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm ">
            Collection Name
          </label>

          <input
            {...form.register("name")}
            className="input h-9"
            placeholder="romance"
          />

          <p className="input-error">{form.formState.errors.name?.message}</p>
        </div>

        {/* description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm ">
            What is this collection about?
          </label>

          <textarea
            {...form.register("description")}
            className="input h-20 resize-none"
            placeholder="my comfort shows."
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

          <label htmlFor="private" className="text-sm h-full mt-0!">
            Is this collection private?
          </label>

          <p className="input-error">
            {form.formState.errors.private?.message}
          </p>
        </div>

        <div className=" pt-8">
          <Button
            disabled={isCreatingCollection}
            type="submit"
            className="bg-black text-white rounded-md w-full h-9"
          >
            {isCreatingCollection ? (
              <div className="flex items-center justify-center gap-2">
                Creating Collecction
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
