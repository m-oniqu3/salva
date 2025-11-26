"use client ";

import { CloseIcon } from "@/components/icons";
import { useRef } from "react";

type Props = {
  closeModal: () => void;
};

function EditCollection(props: Props) {
  const { closeModal } = props;

  console.log(closeModal);

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => hiddenFileInputRef.current?.click();

  return (
    <div className="c-container max-w-sm">
      <header className="relative pb-8 ">
        <h1 className="text-lg font-semibold">Edit Collection</h1>
        <p className="text-sml">Edit your collection.</p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      </header>

      <form>
        {/* name */}
        <div className="flex flex-col gap-1">
          <button type="button" onClick={triggerFileInput}>
            Upload Image
          </button>

          <input
            // {...register("image")}
            ref={hiddenFileInputRef}
            hidden
            type="file"
            // onChange={handleFileChange}
          />

          <input className="input h-9" placeholder="Title" />
        </div>
      </form>
    </div>
  );
}

export default EditCollection;
