"use client";

import { CloseIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";

function Prompt() {
  const { stopPropagation, closeModal } = useModal();

  return (
    <div className="panel max-w-sm mx-auto" onClick={stopPropagation}>
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
