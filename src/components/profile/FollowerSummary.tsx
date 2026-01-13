import Avatar from "@/components/Avatar";
import { ChevronRightIcon, LoadingIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { Follower } from "@/types/user";
import { toggleFollowUser } from "@utils/api/user/follow-user";
import Link from "next/link";
import { useState } from "react";

type Props = {
  userID: string | null;
  follower: Follower;
  isFollowingText: string;
  refreshFollowData: () => void;
};

/**
 * Displays a condensed view of follower information (avatar, name, username, follow status)
 */
function FollowerSummary(props: Props) {
  const {
    userID,
    follower: {
      id: followerID,
      profile: { avatar, username, firstname, lastname },
      isFollowedByViewer: viewerFollows,
    },
    isFollowingText,
    refreshFollowData,
  } = props;

  const { openModal } = useModal();

  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(viewerFollows);

  const isSelf = userID === followerID;

  /**
   * Toggles follow status for a user with optimistic UI updates.
   * Opens login modal if user is not authenticated.
   * Rolls back optimistic update if the server request fails.
   */
  async function handleToggleFollowUser() {
    if (!userID) {
      openModal({ type: ModalEnum.A });
      return;
    }

    setIsLoading(true);

    //optimistic
    setIsFollowing((prevState) => !prevState);

    const { error } = await toggleFollowUser(followerID);

    if (error) {
      return setIsFollowing((prevState) => !prevState); // rollback to original state if server failed
    }

    setIsLoading(false);

    refreshFollowData();
  }

  return (
    <li className="h-20 w-full grid grid-cols-[auto_1fr_90px] place-items-center gap-4 px-10 cursor-pointer hover:bg-zinc-50">
      <Avatar
        avatar={avatar}
        username={username}
        className={"size-11 rounded-full text-xl"}
      />

      <Link href={`/${username}`} className="w-full flex flex-col items-start">
        <p className="text-sm font-semibold capitalize line-clamp-1 cursor-pointer sm:text-sml">
          {firstname ? `${firstname} ${lastname}` : username}
        </p>
        <p className="text-xs font-semibold text-zinc-500 line-clamp-1 cursor-pointer">
          @{username}
        </p>
      </Link>

      <>
        {isLoading && <LoadingIcon className="size-4" />}

        {!isLoading && (
          <>
            {isSelf && <ChevronRightIcon className="size-4" />}

            {!isSelf && (
              <button
                type="button"
                disabled={isLoading}
                className={`h-9 px-3 text-xs font-bold gray text-neutral-600 rounded-full cursor-pointer ${
                  !isFollowing ? "bg-neutral-800 text-white" : " "
                }`}
                onClick={handleToggleFollowUser}
              >
                {isFollowing ? isFollowingText : "Follow"}
              </button>
            )}
          </>
        )}
      </>
    </li>
  );
}

export default FollowerSummary;
