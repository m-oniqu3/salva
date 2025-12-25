import {
  ContextMenuAction,
  ContextMenuActionEnum,
} from "@/context/actions/ContextMenuActions";
import { ContextMenu } from "@/types/context-menu";

export type ContextState = {
  menu: ContextMenu | null;
};

export const initialState: ContextState = {
  menu: null,
};

export function contextMenuReducer(
  state: ContextState,
  action: ContextMenuAction
) {
  switch (action.type) {
    case ContextMenuActionEnum.OPEN_CONTEXT_MENU:
      return {
        ...state,
        menu: action.payload,
      };

    case ContextMenuActionEnum.CLOSE_CONTEXT_MENU:
      return { ...state, menu: null };

    default:
      return state;
  }
}
