"use client";

import Prompt from "@/components/auth/Prompt";
import CollectionCoverPicker from "@/components/collection/CollectionCoverPicker";
import EditCollection from "@/components/collection/EditCollection";
import MobileMenu from "@/components/nav/MobileMenu";
import Followers from "@/components/profile/Followers";
import Following from "@/components/profile/Following";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import CreateCollection from "@components/collection/CreateCollection";
import Modal from "@components/Modal";

function ModalManager() {
  const {
    state: { modal },
    closeModal,
  } = useModal();

  console.log("MM", modal, closeModal);

  const renderedModal = (() => {
    if (!modal || !modal.type) return null;

    switch (modal.type) {
      case ModalEnum.CCM:
        return <CreateCollection closeModal={closeModal} />;

      case ModalEnum.A:
        return <Prompt closeModal={closeModal} />;

      case ModalEnum.F:
        return <Followers closeModal={closeModal} />;

      case ModalEnum.FL:
        return <Following closeModal={closeModal} />;

      case ModalEnum.ECM:
        return <EditCollection closeModal={closeModal} />;

      case ModalEnum.IPM:
        return <CollectionCoverPicker closeModal={closeModal} />;

      case ModalEnum.MM:
        return <MobileMenu closeModal={closeModal} />;

      default:
        return null;
    }
  })();

  if (!renderedModal) return null;

  return <Modal close={closeModal}>{renderedModal}</Modal>;
}

export default ModalManager;
