export enum ContextMenuEnum {
  PM = "PROFILE_MENU",
  COM = "COLLECTION_OPTIONS_MENU",
  AEM = "ADD_ELEMENT_MENU",
}

type ContextMenuState<K extends ContextMenuEnum, P = undefined> = {
  type: K;
  position: { x: number; y: number };
  payload?: P | null;
};

// might need user ID here in the payload
type ProfileMenu = ContextMenuState<ContextMenuEnum.PM, null>;

type CollectionActionsMenu = ContextMenuState<ContextMenuEnum.COM, null>;

type AddElementMenu = ContextMenuState<ContextMenuEnum.AEM, null>;

export type ContextMenu = ProfileMenu | CollectionActionsMenu | AddElementMenu;
