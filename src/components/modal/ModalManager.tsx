"use client";

import Prompt from "@/components/auth/Prompt";
import CollectionCoverPicker from "@/components/modal/CollectionCoverPicker";
import CreateCollection from "@/components/modal/CreateCollection";
import DeleteCollection from "@/components/modal/DeleteCollection";
import EditCollection from "@/components/modal/EditCollection";
import EditProfile from "@/components/modal/EditProfile";
import FilmCollection from "@/components/modal/FilmCollection";
import MassDeleteFilms from "@/components/modal/MassDeleteFilms";
import Modal from "@/components/modal/Modal";
import TransferFilms from "@/components/modal/TransferFilms";
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
      case ModalEnum.CREATE_COLLECTION:
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

      case ModalEnum.MOBILE_MENU:
        return <MobileMenu />;

      case ModalEnum.FCM:
        return <FilmCollection />;

      case ModalEnum.TRANSFER_FILMS:
        return <TransferFilms />;

      case ModalEnum.MDF:
        return <MassDeleteFilms />;

      case ModalEnum.EDIT_PROFILE:
        return <EditProfile />;

      case ModalEnum.DELETE_COLLECTION:
        return <DeleteCollection />;

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
