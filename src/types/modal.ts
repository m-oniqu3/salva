import { EditCollectionDetals } from "@/types/collection";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";

export enum ModalEnum {
  CCM = "CREATE_COLLECTION_MODAL",
  ECM = "EDIT_COLLECTION_MODAL",
  IPM = "IMAGE_PICKER_MODAL",
  A = "AUTH_MODAL",
  F = "FOLLOWERS_MODAL",
  FL = "FOLLOWING_MODAL",
  MM = "MOBILE_MENU",
  FCM = "FILM_COLLECTION_MODAL",
  MCF = "MASS_COPY_FILMS_MODAL",
}

type ModalState<K extends ModalEnum, P = null> = {
  type: K;
  payload?: P;
};

type CreateCollectionModal = ModalState<ModalEnum.CCM>;

type EditCollectionModal = ModalState<
  ModalEnum.ECM,
  { collectionDetails: EditCollectionDetals }
>;

type ImagePickerModal = ModalState<
  ModalEnum.IPM,
  { collectionDetails: EditCollectionDetals }
>;

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
    user: UserMeta;
  }
>;

type MassCopyFilmsModal = ModalState<
  ModalEnum.MCF,
  {
    selectedFilmIDs: Set<number>;
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
  | FilmCollectionModal
  | MassCopyFilmsModal;
