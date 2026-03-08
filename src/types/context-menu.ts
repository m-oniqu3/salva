import { CollectionSummary } from "@/types/collection";
import { ProfileSummary, UserMeta } from "@/types/user";

export enum ContextMenuEnum {
  "PROFILE_MENU" = "PROFILE_MENU",
  "COLLECTION_OPTIONS" = "COLLECTION_OPTIONS_MENU",
  "PROFILE_OPTIONS" = "PROFILE_OPTIONS_MENU",
  "SORT_COLLECTION_PREVIEWS" = "SORT_COLLECTION_PREVIEWS_MENU",
}

type ContextMenuState<K = ContextMenuEnum, P = undefined> = {
  type: K;
  payload?: P | null;
};

// might need user ID here in the payload
type ProfileMenu = ContextMenuState<
  ContextMenuEnum.PROFILE_MENU,
  {
    user: UserMeta;
  }
>;

type CollectionActionsMenu = ContextMenuState<
  ContextMenuEnum.COLLECTION_OPTIONS,
  { summary: CollectionSummary }
>;

type SortCollectionPreviewsMenu =
  ContextMenuState<ContextMenuEnum.SORT_COLLECTION_PREVIEWS>;

type ProfileOptionsMenu = ContextMenuState<
  ContextMenuEnum.PROFILE_OPTIONS,
  { summary: ProfileSummary }
>;

export type ContextMenu =
  | ProfileMenu
  | CollectionActionsMenu
  | ProfileOptionsMenu
  | SortCollectionPreviewsMenu;

export type MenuOption = {
  label: string;
  onClick: () => void;
  className?: string;
};
