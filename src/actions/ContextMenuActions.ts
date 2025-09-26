import { ContextMenuType } from "@/types";

export enum ContextMenuActionEnum {
  OPEN_CONTEXT_MENU = "OPEN_CONTEXT_MENU",
  CLOSE_CONTEXT_MENU = "CLOSE_CONTEXT_MENU",
}

export type OpenContextAction = {
  type: ContextMenuActionEnum.OPEN_CONTEXT_MENU;
  payload: {
    currentContextMenu: ContextMenuType;
    position: { x: number; y: number };
  };
};

export type CloseContextAction = {
  type: ContextMenuActionEnum.CLOSE_CONTEXT_MENU;
};

export type ContextMenuActions = OpenContextAction | CloseContextAction;
