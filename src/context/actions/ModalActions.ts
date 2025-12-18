import { Modal } from "@/types/modal";

export enum ModalActionEnum {
  OPEN_MODAL = "OPEN_MODAL",
  CLOSE_MODAL = "CLOSE_MODAL",
}

export type OpenModalAction = {
  type: ModalActionEnum.OPEN_MODAL;
  payload: Modal;
};

export type CloseModalAction = {
  type: ModalActionEnum.CLOSE_MODAL;
};

export type ModalActions = OpenModalAction | CloseModalAction;
