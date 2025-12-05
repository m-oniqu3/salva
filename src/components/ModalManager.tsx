"use client";

import CollectionCoverPicker from "@/components/collection/CollectionCoverPicker";
import EditCollection from "@/components/collection/EditCollection";
import MobileMenu from "@/components/nav/MobileMenu";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import CreateCollection from "@components/collection/CreateCollection";
import Modal from "@components/Modal";
import { ReactNode } from "react";

function ModalManager() {
  const {
    state: { currentModal },
    closeModal,
  } = useModal();

  console.log("MM", currentModal, closeModal);

  if (!currentModal) return null;

  let ModalContent: ReactNode = null;

  switch (currentModal) {
    case ModalEnum.CREATE_COLLECTION_MODAL:
      ModalContent = <CreateCollection closeModal={closeModal} />;
      break;

    case ModalEnum.ECM:
      ModalContent = <EditCollection closeModal={closeModal} />;
      break;

    case ModalEnum.IPM:
      ModalContent = <CollectionCoverPicker closeModal={closeModal} />;
      break;

    case ModalEnum.MOBILE_MENU:
      ModalContent = <MobileMenu closeModal={closeModal} />;
      break;

    default:
      return null;
  }

  return <Modal close={closeModal}>{ModalContent}</Modal>;
}

export default ModalManager;
