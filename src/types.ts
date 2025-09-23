export enum ModalEnum {
  CREATE_BOARD_MODAL = "CREATE_BOARD_MODAL",
  SHOW_BOARDS_MODAL = "SHOW_BOARDS_MODAL",
  MOBILE_MENU = "MOBILE_MENU",
}

export type ModalType =
  | ModalEnum.CREATE_BOARD_MODAL
  | ModalEnum.SHOW_BOARDS_MODAL
  | ModalEnum.MOBILE_MENU
  | null;

export enum ContextMenuEnum {
  PROFILE_MENU = "PROFILE_MENU",
}

export type ContextMenuType = ContextMenuEnum.PROFILE_MENU | null;
