"use client ";

import Button from "@/components/Button";
import { AddIcon, CloseIcon, LoadingIcon } from "@/components/icons";
import { usePathname } from "next/navigation";
import { useRef, useTransition } from "react";

type Props = {
  closeModal: () => void;
};

function EditCollection(props: Props) {
  const { closeModal } = props;
  const [isEditingCollection, startEditCollectionTransition] = useTransition();

  const pathname = usePathname();

  console.log(pathname);

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => hiddenFileInputRef.current?.click();

  return (
    <div className="c-container max-w-sm">
      <header className="relative pb-8">
        <h1 className="text-lg font-semibold">Edit Collection</h1>
        <p className="text-sml">Edit your collection.</p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <form className="flex flex-col gap-4">
        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml">
            Collection Cover
          </label>

          <button
            type="button"
            onClick={triggerFileInput}
            className="flex justify-center items-center size-28 rounded-xl bg-slate-100 z-0 cursor-pointer"
          >
            <AddIcon className="size-5 text-slate-400" />
          </button>

          <input
            // {...register("image")}
            ref={hiddenFileInputRef}
            hidden
            type="file"
            // onChange={handleFileChange}
          />

          <p className="input-error"></p>
        </div>

        {/* name */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sml">
            Collection Name
          </label>

          <input
            // {...form.register("name")}
            placeholder="comfort rewatches"
            className="input h-9"
          />

          <p className="input-error"></p>
        </div>

        {/* description */}
        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sml">
            What is this collection about?
          </label>

          <textarea
            // {...form.register("description")}
            className="input h-20 resize-none"
            placeholder="movies i throw on when my brain is tired"
          ></textarea>

          <p className="input-error">
            {/* {form.formState.errors.description?.message} */}
          </p>
        </div>

        <div className="">
          <Button
            disabled={isEditingCollection}
            type="submit"
            className="bg-black text-white rounded-md w-full h-9"
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
    </div>
  );
}

export default EditCollection;
