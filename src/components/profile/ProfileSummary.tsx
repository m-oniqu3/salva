"use client";

import Avatar from "@/components/Avatar";
import ProfileToolbar from "@/components/profile/ProfileToolbar";
import { useModal } from "@/context/useModal";
import { Profile } from "@/types/user";

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

  // Is the current user viewing their own profile?
  const isUserViewingSelf = profileID === userID;
  const isLoggedIn = Boolean(userID);

  return (
    <section className="py-4 max-w-[450px]">
      <article className="flex flex-col gap-4">
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-10 rounded-full text-lg lg:size-10"}
        />

        <div className="flex flex-col">
          <h2 className="font-bold text-lg m-0  text-neutral-800 ">
            <span>{firstname ? `${firstname} ${lastname}` : username}</span>
          </h2>

          <p className="text-[13px] font-semibold text-neutral-600">
            @{username}
          </p>
          <p className="text-zinc-500 leading-5 text-[13px]">{bio}</p>
        </div>

        {isUserViewingSelf && isLoggedIn && <ProfileToolbar />}
      </article>
    </section>
  );
}

export default ProfileSummary;
