"use client";

import Avatar from "@/components/Avatar";
import { ChevronRightIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { Follower } from "@/types/user";
import { useRouter } from "next/navigation";

type Props = {
  profile: Follower;
};

function FollowerPreview(props: Props) {
  const {
    profile: { id, avatar, username, firstname, lastname },
  } = props;

  const { closeModal } = useModal();
  const router = useRouter();

  function handleClick() {
    router.push("/" + username);
    closeModal();
  }

  return (
    <button
      onClick={handleClick}
      key={id}
      className="h-[72px] w-full grid grid-cols-[60px_auto_25px] place-items-center px-8 cursor-pointer no-scrollbar hover:bg-zinc-50"
    >
      <div className="mr-auto">
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-11 rounded-full text-xl"}
        />
      </div>

      <div className="w-full flex flex-col items-start ">
        <p className="font-semibold line-clamp-1">@{username}</p>
        <p className="text-sml text-zinc-500 font-semibold capitalize line-clamp-1">
          {firstname} {lastname}
        </p>
      </div>

      <ChevronRightIcon className="size-4" />
    </button>
  );
}

export default FollowerPreview;
