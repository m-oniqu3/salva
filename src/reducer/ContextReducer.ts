import {
  ContextMenuActions,
  ContextMenuActionTypes,
} from "@/actions/ContextMenuActions";
import { ContextMenuType } from "@/types";

export type ContextState = {
  currentContextMenu: ContextMenuType;
  isOpen: boolean;
  position: { x: number; y: number };
};

export const initialState: ContextState = {
  currentContextMenu: null,
  isOpen: false,
  position: { x: 0, y: 0 },
};

export function contextMenuReducer(
  state: ContextState,
  action: ContextMenuActions
) {
  switch (action.type) {
    case ContextMenuActionTypes.OPEN_CONTEXT_MENU:
      return {
        ...state,
        currentContextMenu: action.payload.currentContextMenu,
        position: action.payload.position,
        isOpen: !state.isOpen,
      };

    case ContextMenuActionTypes.CLOSE_CONTEXT_MENU:
      return {
        ...state,
        currentContextMenu: null,
        isOpen: false,
      };

    default:
      return state;
  }
}
