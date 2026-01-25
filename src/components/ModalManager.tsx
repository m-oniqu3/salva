"use client";

import Prompt from "@/components/auth/Prompt";
import CollectionCoverPicker from "@/components/collection/CollectionCoverPicker";
import EditCollection from "@/components/collection/EditCollection";
import FilmCollection from "@/components/collection/FilmCollection";
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
        return <CreateCollection />;

      case ModalEnum.A:
        return <Prompt />;

      case ModalEnum.F:
        return <Followers />;

      case ModalEnum.FL:
        return <Following />;

      case ModalEnum.ECM:
        return <EditCollection />;

      case ModalEnum.IPM:
        return <CollectionCoverPicker />;

      case ModalEnum.MM:
        return <MobileMenu />;

      case ModalEnum.FCM:
        return <FilmCollection />;

      default:
        throw new Error(
          "Modal type not allowed or missing. No modal to render",
        );
    }
  })();

  if (!rendered_modal) return null;

  return <Modal closeModal={closeModal}>{rendered_modal}</Modal>;
}

export default ModalManager;
