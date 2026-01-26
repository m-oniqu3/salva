import { ContextMenu } from "@/types/context-menu";

export enum ContextMenuActionEnum {
  OPEN_CONTEXT_MENU = "OPEN_CONTEXT_MENU",
  CLOSE_CONTEXT_MENU = "CLOSE_CONTEXT_MENU",
  UPDATE_POSITION = "UPDATE_POSITION",
}

export type OpenContextAction = {
  type: ContextMenuActionEnum.OPEN_CONTEXT_MENU;
  payload: ContextMenu;
};

export type CloseContextAction = {
  type: ContextMenuActionEnum.CLOSE_CONTEXT_MENU;
};

export type UpdatePositionContextAction = {
  type: ContextMenuActionEnum.UPDATE_POSITION;
  payload: { top: number; left: number };
};

export type ContextMenuAction =
  | OpenContextAction
  | CloseContextAction
  | UpdatePositionContextAction;
