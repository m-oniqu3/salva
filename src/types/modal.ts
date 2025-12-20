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

type CreateCollectionModal = ModalState<ModalEnum.CCM, null>;

type EditCollectionModal = ModalState<ModalEnum.ECM, null>;

type ImagePickerModal = ModalState<ModalEnum.IPM, null>;

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

export type Modal =
  | CreateCollectionModal
  | EditCollectionModal
  | ImagePickerModal
  | AuthModal
  | FollowersModal
  | FollowingModal
  | MobileMenuModal;
