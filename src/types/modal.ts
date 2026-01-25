import { CollectionSummary } from "@/types/collection";
import { TMDBFilm } from "@/types/tmdb";

export enum ModalEnum {
  CCM = "CREATE_COLLECTION_MODAL",
  ECM = "EDIT_COLLECTION_MODAL",
  IPM = "IMAGE_PICKER_MODAL",
  A = "AUTH_MODAL",
  F = "FOLLOWERS_MODAL",
  FL = "FOLLOWING_MODAL",
  MM = "MOBILE_MENU",
  FCM = "FILM_COLLECTION_MODAL",
}

type ModalState<K extends ModalEnum, P = null> = {
  type: K;
  payload?: P;
};

type CreateCollectionModal = ModalState<ModalEnum.CCM>;

type EditCollectionModal = ModalState<
  ModalEnum.ECM,
  {
    collectionSummary: CollectionSummary;
  }
>;

type ImagePickerModal = ModalState<ModalEnum.IPM>;

type AuthModal = ModalState<ModalEnum.A>;

type FollowersModal = ModalState<
  ModalEnum.F,
  { userID: string | null; targetUserID: string }
>;

type FollowingModal = ModalState<
  ModalEnum.FL,
  { userID: string | null; targetUserID: string }
>;

type MobileMenuModal = ModalState<ModalEnum.MM>;

type FilmCollectionModal = ModalState<
  ModalEnum.FCM,
  {
    film: TMDBFilm;
  }
>;

export type Modal =
  | CreateCollectionModal
  | EditCollectionModal
  | ImagePickerModal
  | AuthModal
  | FollowersModal
  | FollowingModal
  | MobileMenuModal
  | FilmCollectionModal;
