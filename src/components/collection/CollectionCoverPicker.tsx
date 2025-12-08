"use client";

import { CloseIcon } from "@/components/icons";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { useRef } from "react";

type Props = {
  closeModal: () => void;
};

function CollectionCoverPicker(props: Props) {
  const { closeModal } = props;
  const { dispatch } = useModal();

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => hiddenFileInputRef.current?.click();

  //todo : get the collection images from the db for the given collection

  // close IPM & open ECM
  function handleCloseModal() {
    closeModal();
    dispatch({ type: ModalActionEnum.OPEN_MODAL, payload: ModalEnum.ECM });
  }

  return (
    <div className="c-container max-w-sm">
      <header className="relative pb-8">
        <h1 className="text-lg font-semibold text-neutral-800">
          Update Collection Cover
        </h1>

        <div className="flex text-sml">
          <p>Select an image or</p>
          <span>&nbsp;</span>

          <button
            type="button"
            className="underline underline-offset-1 cursor-pointer"
            onClick={triggerFileInput}
          >
            upload
          </button>

          <input
            // {...register("image")}
            ref={hiddenFileInputRef}
            hidden
            type="file"
            // onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleCloseModal}
          className="absolute top-1 right-0 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>
    </div>
  );
}

export default CollectionCoverPicker;
