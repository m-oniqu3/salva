import { ModalActionEnum, ModalActions } from "@/actions/ModalActions";
import { ModalType } from "@/types";

export type State = {
  currentModal: ModalType;
};

export const initialState: State = {
  currentModal: null,
};

export function modalReducer(state: State, action: ModalActions) {
  switch (action.type) {
    case ModalActionEnum.OPEN_MODAL:
      return {
        ...state,
        currentModal: action.payload,
      };
    case ModalActionEnum.CLOSE_MODAL:
      return {
        ...state,
        currentModal: null,
      };
    default:
      return state;
  }
}
