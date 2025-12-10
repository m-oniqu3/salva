"use client";

import { CloseIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";

type Props = {
  closeModal: () => void;
};

function Prompt(props: Props) {
  const { closeModal } = props;
  const { stopPropagation } = useModal();

  return (
    <div className="c-container max-w-sm mx-auto" onClick={stopPropagation}>
      <header className="relative pb-10">
        <h1 className="text-lg font-semibold text-neutral-800">Join Salva</h1>
        <p className="text-sml">Welcome</p>

        <button
          onClick={closeModal}
          className="absolute top-0 right-0 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>
      prompt
    </div>
  );
}

export default Prompt;
