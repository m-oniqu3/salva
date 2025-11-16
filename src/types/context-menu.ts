export enum ContextMenuEnum {
  PROFILE_MENU = "PROFILE_MENU",
  EDIT_COLLECTION_MENU = "EDIT_COLLECTION_MENU",
  ADD_ELEMENT_MENU = "ADD_ELEMENT_MENU",
}

export type ContextMenuType =
  | ContextMenuEnum.PROFILE_MENU
  | ContextMenuEnum.EDIT_COLLECTION_MENU
  | ContextMenuEnum.ADD_ELEMENT_MENU
  | null;
