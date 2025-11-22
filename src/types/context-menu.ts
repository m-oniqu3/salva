export enum ContextMenuEnum {
  PROFILE_MENU = "PROFILE_MENU",
  COLLECTION_ACTIONS_MENU = "COLLECTION_ACTIONS_MENU",
  ADD_ELEMENT_MENU = "ADD_ELEMENT_MENU",
}

export type ContextMenuType =
  | ContextMenuEnum.PROFILE_MENU
  | ContextMenuEnum.COLLECTION_ACTIONS_MENU
  | ContextMenuEnum.ADD_ELEMENT_MENU
  | null;
