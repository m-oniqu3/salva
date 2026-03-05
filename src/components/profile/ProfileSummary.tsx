"use client";

import Avatar from "@/components/Avatar";
import ProfileToolbar from "@/components/profile/ProfileToolbar";
import { Profile, ProfileSummary as PSummary } from "@/types/user";
import { getAvatarURL } from "@utils/get-cover-url";

type Props = {
  profileSummary: PSummary;
  authUserID: Profile["user_id"] | null;
};

function ProfileSummary({ profileSummary, authUserID }: Props) {
  const {
    user_id: profileID,
    firstname,
    lastname,
    username,
    avatar,
    bio,
    collections_created,
  } = profileSummary;

  // Is the current user viewing their own profile?
  const isUserViewingSelf = profileID === authUserID;
  const isLoggedIn = Boolean(authUserID);

  return (
    <section className="py-4 max-w-[450px]">
      <article className="flex flex-col gap-4">
        <Avatar
          avatar={avatar ? getAvatarURL(avatar) : ""}
          username={username}
          name={firstname || username}
          className={"size-10 rounded-full text-lg lg:size-10"}
        />

        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-lg m-0  text-neutral-800 ">
            <span>{firstname ? `${firstname} ${lastname}` : username}</span>
          </h2>

          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-neutral-600">
              @{username}
            </p>

            <span>&bull;</span>

            <p className="text-[13px] font-semibold text-neutral-600">
              {collections_created}{" "}
              {collections_created === 1 ? "collection" : "collections"}
            </p>
          </div>

          <p className="text-neutral-600 leading-5 text-[13px]">{bio}</p>
        </div>

        {isUserViewingSelf && isLoggedIn && (
          <ProfileToolbar profileSummary={profileSummary} />
        )}
      </article>
    </section>
  );
}

export default ProfileSummary;
