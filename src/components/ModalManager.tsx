"use client";

import CreateCollection from "@/components/collection/CreateCollection";
import Modal from "@/components/Modal";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types";
import { ReactNode } from "react";

function ModalManager() {
  const {
    state: { currentModal },
    closeModal,
  } = useModal();

  if (!currentModal) return null;

  let ModalContent: ReactNode = null;

  switch (currentModal) {
    case ModalEnum.CREATE_BOARD_MODAL:
      ModalContent = <CreateCollection />;
      break;

    default:
      return null;
  }

  return <Modal close={closeModal}>{ModalContent}</Modal>;
}

export default ModalManager;
