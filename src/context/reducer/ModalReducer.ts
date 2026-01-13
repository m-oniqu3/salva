import { ModalActionEnum, ModalActions } from "@/context/actions/ModalActions";
import { Modal } from "@/types/modal";

export type State = {
  modal: Modal | null;
};

export const initialState: State = {
  modal: null,
};

export function modalReducer(state: State, action: ModalActions) {
  switch (action.type) {
    case ModalActionEnum.OPEN_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case ModalActionEnum.CLOSE_MODAL:
      return {
        ...state,
        modal: null,
      };
    default:
      return state;
  }
}
