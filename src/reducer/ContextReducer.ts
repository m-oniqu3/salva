import {
  ContextMenuActionEnum,
  ContextMenuActions,
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
    case ContextMenuActionEnum.OPEN_CONTEXT_MENU:
      const { currentContextMenu, position } = action.payload;

      if (state.currentContextMenu === currentContextMenu) {
        return {
          ...state,
          currentContextMenu,
          position,
          isOpen: !state.isOpen, //toggle it otherwise it stays close after first toggle
        };
      } else {
        return { ...state, currentContextMenu, position, isOpen: true };
      }

    case ContextMenuActionEnum.CLOSE_CONTEXT_MENU:
      return { ...state, currentContextMenu: null, isOpen: false };

    default:
      return state;
  }
}
