"use client";

import Avatar from "@/components/Avatar";
import { useModal } from "@/context/useModal";
import useFollowStates from "@/hooks/useFollowStates";
import { Profile } from "@/types/user";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  profile: Profile;
  userID: Profile["user_id"] | null;
};

function ProfileSummary({ profile, userID }: Props) {
  const { openModal } = useModal();

  const {
    user_id: profileID,
    firstname,
    lastname,
    username,
    avatar,
    bio,
  } = profile;

  const { result } = useFollowStates(userID, profileID);
  const qc = useQueryClient();

  // Is the current user viewing their own profile?
  const isUserViewingSelf = profileID === userID;
  const isLoggedIn = Boolean(userID);

  return (
    <section className="py-4 max-w-[450px]">
      <article className="flex flex-col gap-1">
        {/* Avatar */}
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-8 rounded-full text-lg lg:size-10"}
        />

        {/* Name */}
        <div className="mt-2">
          <h2 className="font-semibold text-lg  text-neutral-800 ">
            <span>{firstname ? `${firstname} ${lastname}` : username}</span>
          </h2>
        </div>

        {/* Bio */}
        <p className="text-zinc-500 leading-5 text-[13px]">{bio}</p>

        <div className="flex flex-wrap gap-2 mt-1 font-semibold text-neutral-800 text-xs">
          {/* Username */}
          <p className="">@{username}</p>
          <span>&#xb7;</span>

          {isUserViewingSelf && isLoggedIn && (
            <button className="cursor-pointer">Edit Profile</button>
          )}
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
