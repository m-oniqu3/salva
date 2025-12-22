"use client";

import { ChevronRightIcon, LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";
import { toggleFollowUser } from "@utils/api/user/follow-user";
import { useState } from "react";

type Props = {
  id: string; // follower ID
  userID: string | null | undefined;
  canFollowUser: boolean; // can the auth user follow this user?
  isFollowedByViewer: boolean; // isFollowedByAuthUser : is the auth user following this follower?
  isRefetchingFollowerInformation: boolean;
  refetchFollowerInformation: () => void;
};

function FollowerPreviewButton(props: Props) {
  const {
    userID,
    id: followerID,
    canFollowUser,
    isFollowedByViewer: initialFollowState,
  } = props;

  const { openModal } = useModal();
  const [isToggling, setIsToggling] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialFollowState);
  const qc = useQueryClient();

  /**
   *  If no user, prompt user to log in; Open Prompt modal.
   *  Otherwise, toggle follow user; (Follow/un-follow the target user).
   *  After toggling, invalidate the query -> triggers a refetch
   */
  async function handleToggleFollowUser() {
    if (!userID) return openModal({ type: ModalEnum.A });

    setIsToggling(true);

    //optimistic
    setIsFollowing((prevState) => !prevState);

    const { error } = await toggleFollowUser(followerID);

    if (error) {
      setIsFollowing((prevState) => !prevState); // rollback to original state if server failed
      return;
    }

    await qc.invalidateQueries({ queryKey: ["follow"] });
    // refetchFollowerInformation();

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
