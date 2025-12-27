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
    state,
    state: { modal },
    closeModal,
  } = useModal();

  console.log("MM", state);

  const rendered_modal = (() => {
    if (!modal) return null;

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
        throw new Error(
          "Modal type not allowed or missing. No modal to render"
        );
    }
  })();

  if (!rendered_modal) return null;

  return <Modal closeModal={closeModal}>{rendered_modal}</Modal>;
}

export default ModalManager;
