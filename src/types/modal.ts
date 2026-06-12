import CollectionSummary from "@/components/collection/CollectionSummary";
import { EditCollectionDetals } from "@/types/collection";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import { Profile, ProfileSummary, UserMeta } from "@/types/user";

export enum ModalEnum {
  CREATE_COLLECTION = "CREATE_COLLECTION_MODAL",
  ECM = "EDIT_COLLECTION_MODAL",
  IPM = "IMAGE_PICKER_MODAL",
  A = "AUTH_MODAL",
  F = "FOLLOWERS_MODAL",
  FL = "FOLLOWING_MODAL",
  FCM = "FILM_COLLECTION_MODAL",
  TRANSFER_FILMS = "TRANSFER_FILMS_MODAL",
  MDF = "MASS_DELETE_FILMS_MODAL",
  MOBILE_MENU = "MOBILE_MENU_MODAL",
  EDIT_PROFILE = "EDIT_PROFILE-MODAL",
  DELETE_COLLECTION = "DELETE-COLLECTION_MODAL",
  FILM_DETAILS_MODAL = "FILM_DETAILS_MODAL",
  LOADING = "LOADING_MODAL",
}

type LoadingModal = ModalState<ModalEnum.LOADING>;

type FilmDetailsModal = ModalState<
  ModalEnum.FILM_DETAILS_MODAL,
  {
    data: {
      film: Movie | TVShow;
      media_type: MediaType;
      user: UserMeta;
      credits: Credits;
    };
  }
>;

type DeleteCollectionModal = ModalState<
  ModalEnum.DELETE_COLLECTION,
  { summary: CollectionSummary }
>;

type ModalState<K extends ModalEnum, P = null> = {
  type: K;
  payload?: P;
};

type CreateCollectionModal = ModalState<
  ModalEnum.CREATE_COLLECTION,
  { collectionName: string; film: TMDBFilm } | null
>;

type MobileMenuModal = ModalState<
  ModalEnum.MOBILE_MENU,
  { profile: Profile | null }
>;
type AuthModal = ModalState<ModalEnum.A>;

type EditProfileModal = ModalState<
  ModalEnum.EDIT_PROFILE,
  { profileSummary: ProfileSummary }
>;

type EditCollectionModal = ModalState<
  ModalEnum.ECM,
  { collectionDetails: EditCollectionDetals }
>;

//todo - rename to collectioncover picker modal
type ImagePickerModal = ModalState<
  ModalEnum.IPM,
  { collectionDetails: EditCollectionDetals }
>;

type FollowersModal = ModalState<
  ModalEnum.F,
  { userID: string | null; targetUserID: string }
>;

type FollowingModal = ModalState<
  ModalEnum.FL,
  { userID: string | null; targetUserID: string }
>;

type FilmCollectionModal = ModalState<
  ModalEnum.FCM,
  { film: TMDBFilm; user: UserMeta }
>;

type TransferFilmsModal = ModalState<
  ModalEnum.TRANSFER_FILMS,
  | {
      type: "copy";
      selectedFilmIDs: number[];
      sourceCollectionID: number;
      clearSelection: () => void;
    }
  | {
      type: "move";
      selectedIDs: number[];
      selectedFilmIDs: number[];
      sourceCollectionID: number;
      clearSelection: () => void;
    }
>;

type MassDeleteFilms = ModalState<
  ModalEnum.MDF,
  {
    selectedFilmIDs: number[];
    collectionID: number;
    clearSelection: () => void;
  }
>;

export type Modal =
  | DeleteCollectionModal
  | CreateCollectionModal
  | EditCollectionModal
  | ImagePickerModal
  | AuthModal
  | FollowersModal
  | FollowingModal
  | MobileMenuModal
  | FilmCollectionModal
  | FilmDetailsModal
  | TransferFilmsModal
  | MassDeleteFilms
  | LoadingModal
  | EditProfileModal;
