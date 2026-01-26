"use client";

import { useModal } from "@/context/useModal";
import Portal from "@components/Portal";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  closeModal: () => void;
};

function Modal(props: Props) {
  const { children, closeModal } = props;

  const {
    state: { modal },
  } = useModal();

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modal]);

  return (
    <Portal selector="#modal" close={closeModal}>
      <div
        className="fixed p-4 w-full inset-0 z-50 flex items-center justify-center bg-black/70"
        onClick={closeModal}
      >
        {children}
      </div>
    </Portal>
  );
}

export default Modal;
