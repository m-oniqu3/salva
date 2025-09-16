"use client";

import { ModalActionTypes } from "@/actions/ModalActions";
import Modal from "@/components/Modal";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types";
import { ReactNode } from "react";

function ModalManager() {
  const {
    state: { currentModal },
    dispatch,
  } = useModal();

  if (!currentModal) return null;

  let ModalContent: ReactNode = null;

  switch (currentModal) {
    case ModalEnum.CREATE_BOARD_MODAL:
      ModalContent = <p>hey</p>;
      break;

    default:
      return null;
  }

  function closeModal() {
    dispatch({ type: ModalActionTypes.CLOSE_MODAL });
  }

  return <Modal close={closeModal}>{ModalContent}</Modal>;
}

export default ModalManager;
