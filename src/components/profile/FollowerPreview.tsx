"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { ChevronRightIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { Follower } from "@/types/user";
import { useRouter } from "next/navigation";

type Props = {
  userID?: string | null;
  follower: Follower;
};

function FollowerPreview(props: Props) {
  const { closeModal } = useModal();
  const router = useRouter();

  const {
    userID,
    follower: {
      id,
      profile: { avatar, username, firstname, lastname },
      isUserFollowing,
    },
  } = props;

  function handleClick() {
    router.push("/" + username);
    closeModal();
  }

  // User isn't supposed to be able to follow themselves
  const canFollow = userID !== id;

  return (
    <div
      onClick={handleClick}
      key={id}
      className="h-[72px] w-full grid grid-cols-[60px_auto_60px] place-items-center px-8 cursor-pointer no-scrollbar hover:bg-zinc-50"
    >
      <div className="mr-auto">
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-11 rounded-full text-xl"}
        />
      </div>

      <div className="w-full flex flex-col items-start ">
        <p className="font-semibold capitalize line-clamp-1">
          {firstname} {lastname}
        </p>
        <p className="text-sml font-semibold text-zinc-500 line-clamp-1">
          @{username} {isUserFollowing}
        </p>
      </div>

      {canFollow && (
        <Button className=" bg-neutral-800 text-white">
          {isUserFollowing ? "Following" : "Follow"}
        </Button>
      )}

      {!canFollow && <ChevronRightIcon className="size-4" />}
    </div>
  );
}

export default FollowerPreview;
