import { CollectionSummary } from "@/types/collection";
import { TMDBFilm } from "@/types/tmdb";
import { ProfileSummary } from "@/types/user";

export enum ContextMenuEnum {
  "PM" = "PROFILE_MENU",
  "COLLECTION_OPTIONS" = "COLLECTION_OPTIONS_MENU",
  "PROFILE_OPTIONS" = "PROFILE_OPTIONS_MENU",
  "AEM" = "ADD_ELEMENT_MENU",
  "CPM" = "COLLECTION_PICKER_MENU",
}

type ContextMenuState<K = ContextMenuEnum, P = undefined> = {
  type: K;
  payload?: P | null;
};

// might need user ID here in the payload
type ProfileMenu = ContextMenuState<ContextMenuEnum.PM, null>;

type CollectionActionsMenu = ContextMenuState<
  ContextMenuEnum.COLLECTION_OPTIONS,
  { summary: CollectionSummary }
>;

type AddElementMenu = ContextMenuState<ContextMenuEnum.AEM, null>;

type CollectionPickerMenu = ContextMenuState<
  ContextMenuEnum.CPM,
  {
    userID?: string | null;
    film: TMDBFilm;
  }
>;

type ProfileOptionsMenu = ContextMenuState<
  ContextMenuEnum.PROFILE_OPTIONS,
  { summary: ProfileSummary }
>;

export type ContextMenu =
  | ProfileMenu
  | CollectionActionsMenu
  | ProfileOptionsMenu
  | AddElementMenu
  | CollectionPickerMenu;
