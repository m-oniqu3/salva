import { CollectionSummary } from "@/types/collection";

export enum ContextMenuEnum {
  "PM" = "PROFILE_MENU",
  "COM" = "COLLECTION_OPTIONS_MENU",
  "AEM" = "ADD_ELEMENT_MENU",
  "CPM" = "COLLECTION_PICKER_MENU",
}

type ContextMenuState<K = ContextMenuEnum, P = undefined> = {
  type: K;
  position: { top?: number; left?: number; right?: number; bottom?: number };
  payload?: P | null;
};

// might need user ID here in the payload
type ProfileMenu = ContextMenuState<ContextMenuEnum.PM, null>;

type CollectionActionsMenu = ContextMenuState<
  ContextMenuEnum.COM,
  {
    collectionSummary: CollectionSummary;
  }
>;

type AddElementMenu = ContextMenuState<ContextMenuEnum.AEM, null>;

type CollectionPickerMenu = ContextMenuState<ContextMenuEnum.CPM, null>;

export type ContextMenu =
  | ProfileMenu
  | CollectionActionsMenu
  | AddElementMenu
  | CollectionPickerMenu;
