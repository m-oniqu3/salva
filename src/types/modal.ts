export enum ModalEnum {
  CCM = "CREATE_COLLECTION_MODAL",
  ECM = "EDIT_COLLECTION_MODAL",
  IPM = "IMAGE_PICKER_MODAL",
  A = "AUTH_MODAL",
  F = "FOLLOWERS_MODAL",
  FL = "FOLLOWING_MODAL",
  MM = "MOBILE_MENU",
}

type ModalState<K extends ModalEnum, P = undefined> = {
  type: K;
  payload?: P | null;
};

export type CreateCollectionModal = ModalState<ModalEnum.CCM, null>;

export type EditCollectionModal = ModalState<ModalEnum.ECM, null>;

export type ImagePickerModal = ModalState<ModalEnum.IPM, null>;

export type AuthModal = ModalState<ModalEnum.A>;

export type FollowersModal = ModalState<
  ModalEnum.F,
  { userID: string | null; targetUserID: string }
>;

export type MobileMenuModal = ModalState<ModalEnum.MM>;

export type FollowingModal = ModalState<ModalEnum.FL>;

export type Modal =
  | CreateCollectionModal
  | EditCollectionModal
  | ImagePickerModal
  | AuthModal
  | FollowersModal
  | MobileMenuModal;
