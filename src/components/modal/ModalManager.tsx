"use client";

import Prompt from "@/components/auth/Prompt";
import CollectionCoverPicker from "@/components/modal/CollectionCoverPicker";
import CreateCollection from "@/components/modal/CreateCollection";
import EditCollection from "@/components/modal/EditCollection";
import FilmCollection from "@/components/modal/FilmCollection";
import MassCopyFilms from "@/components/modal/MassCopyFilms";
import Modal from "@/components/modal/Modal";
import MobileMenu from "@/components/nav/MobileMenu";
import Followers from "@/components/profile/Followers";
import Following from "@/components/profile/Following";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";

function ModalManager() {
  const {
    state,
    state: { modal },
    closeModal,
  } = useModal();

  // console.log("MM", state);

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

      case ModalEnum.MCF:
        return <MassCopyFilms />;

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
