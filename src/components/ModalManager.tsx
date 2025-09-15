"use client";

import { ModalActionTypes } from "@/actions/ModalActions";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types";
import { ReactNode } from "react";

function ModalManager() {
  const { state, dispatch } = useModal();

  let ModalContent: ReactNode = null;

  switch (state.currentModal) {
    case ModalEnum.CREATE_BOARD_MODAL:
      ModalContent = <p>hey</p>;
      break;

    default:
      return null;
  }

  const closeModal = () => dispatch({ type: ModalActionTypes.CLOSE_MODAL });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={closeModal}
      />
      {/* Content */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg">
        {ModalContent}
      </div>
    </div>
  );
}

export default ModalManager;
