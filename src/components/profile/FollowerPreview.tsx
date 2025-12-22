"use client";

import Avatar from "@/components/Avatar";
import FollowerPreviewButton from "@/components/profile/FollowerPreviewButton";
import { useModal } from "@/context/useModal";
import { Follower } from "@/types/user";
import { useRouter } from "next/navigation";

type Props = {
  userID?: string | null;
  follower: Follower;
  isRefetching: boolean;
  refetch: () => void;
};

function FollowerPreview(props: Props) {
  const { closeModal } = useModal();

  const router = useRouter();

  const {
    userID,
    follower: {
      id: followerID,
      profile: { avatar, username, firstname, lastname },
      isFollowedByViewer,
    },
    isRefetching,
    refetch,
  } = props;

  // User isn't supposed to be able to follow themselves
  const canFollowUser = userID !== followerID;

  function handleClick() {
    router.push("/" + username);
    closeModal();
  }

  return (
    <li
      key={followerID}
      onClick={handleClick}
      className="h-20 w-full grid grid-cols-[auto_1fr_90px] place-items-center gap-4 px-10 cursor-pointer hover:bg-zinc-50 "
    >
      <div className="mr-auto" onClick={handleClick}>
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-12 rounded-full text-xl"}
        />
      </div>

      <div className="w-full flex flex-col items-start" onClick={handleClick}>
        <p className="text-sm font-semibold capitalize line-clamp-1 cursor-pointer sm:text-sml">
          {firstname ? `${firstname} ${lastname}` : username}
        </p>
        <p className="text-xs font-semibold text-zinc-500 line-clamp-1 cursor-pointer">
          @{username}
        </p>
      </div>

      <FollowerPreviewButton
        key={followerID}
        userID={userID}
        id={followerID}
        canFollowUser={canFollowUser}
        isFollowedByViewer={isFollowedByViewer}
        isRefetchingFollowerInformation={isRefetching}
        refetchFollowerInformation={refetch}
      />
    </li>
  );
}

export default FollowerPreview;
