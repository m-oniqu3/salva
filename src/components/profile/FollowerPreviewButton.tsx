"use client";

import { ChevronRightIcon, LoadingIcon } from "@/components/icons";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { toggleFollowUser } from "@utils/api/user/follow-user";
import { useState } from "react";

type Props = {
  userID: string | null | undefined;
  id: string; // follower ID
  canFollowUser: boolean;
  isFollowedByViewer: boolean; // isFollowedByAuthUser : is the auth user following this follower?
  isRefetching: boolean;
  refetch: () => void;
};

function FollowerPreviewButton(props: Props) {
  const {
    userID,
    id,
    canFollowUser,
    isFollowedByViewer: initialFollowState,
    refetch,
  } = props;

  const { dispatch } = useModal();
  const [isToggling, setIsToggling] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialFollowState);

  function openLoginModal() {
    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: { type: ModalEnum.A },
    });
  }

  /**
   *  If no user, prompt user to log in; Open Prompt modal.
   *  Otherwise, toggle follow user; (Follow/un-follow the target user).
   *  After toggling, manually update the cache instead of refetching from the server since its just a boolean change.
   */
  async function handleToggleFollowUser() {
    if (!userID) return openLoginModal;

    setIsToggling(true);

    //optimistic
    setIsFollowing((prevState) => !prevState);

    // Follow/Unfollow the user & refetch the follower information
    const { error } = await toggleFollowUser(id);
    if (error) {
      console.log(error, handleToggleFollowUser.name);
      setIsFollowing((prevState) => !prevState); // rollback to original state if server failed

      return;
    }

    refetch();

    setIsToggling(false);
  }

  // Following the user
  if (isToggling) return <LoadingIcon className="size-4" />;

  // Can't follower user
  if (!canFollowUser) return <ChevronRightIcon className="size-4" />;

  // !isRefetching & canFollowUser
  return (
    <button
      type="button"
      disabled={isToggling}
      className={`h-10 px-4 text-xs font-bold gray text-neutral-600 rounded-full cursor-pointer ${
        isFollowing ? "text-neutral-600 " : "bg-neutral-800 text-white "
      }`}
      onClick={handleToggleFollowUser}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowerPreviewButton;
