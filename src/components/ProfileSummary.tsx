"use client";

import Avatar from "@/components/Avatar";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import { Profile } from "@/types/user";
import { toggleFollowUser } from "@utils/api/user/follow-user";

type Props = {
  profile: Profile;
  userID: Profile["user_id"] | null;
};

function ProfileSummary({ profile, userID }: Props) {
  const { dispatch } = useModal();

  const {
    user_id: profileID,
    firstname,
    lastname,
    username,
    avatar,
    bio,
  } = profile;

  // Is the current user viewing their own profile?
  const iseViewingSelf = profileID === userID;

  /**
   * Handles following or unfollowing a user.
   *
   * Uses the `userID` to determine is a current user is present. (Is there a session present? Is the user logged in?)
   *
   * Follow the target user if logged in, otherwise prompt the user to log in.
   */
  function handleFollowUser() {
    // If no user, prompt user to log in
    if (!userID) {
      return dispatch({
        type: ModalActionEnum.OPEN_MODAL,
        payload: ModalEnum.A,
      });
    }

    toggleFollowUser(profile.user_id);
  }

  return (
    <section className="py-4 max-w-[450px]">
      <article className="flex flex-col gap-1">
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-12 rounded-full text-xl"}
        />

        <div className="mt-4">
          <h2 className="font-semibold text-lg capitalize text-neutral-800">
            {firstname && (
              <span>
                {firstname} {lastname}
              </span>
            )}
            {!firstname && username && <span>{username}</span>}
          </h2>
        </div>

        {bio && <p className="text-zinc-500 leading-5 text-[13px]">{bio}</p>}

        <div className="flex gap-2 font-semibold text-neutral-800 text-xs">
          <p className="">@{username}</p>

          <span>&#xb7;</span>

          <p>{username.length}&nbsp;Following</p>

          {bio && <span>&#xb7;</span>}

          <p className="font-semibold flex gap-1">
            <span>{bio?.length ? bio?.length - 12 : 8}</span>
            <span>{bio?.length === 1 ? "Follower" : "Followers"}</span>
          </p>

          {!iseViewingSelf && <span>&#xb7;</span>}

          {!iseViewingSelf && (
            <button onClick={handleFollowUser} className="cursor-pointer">
              Follow
            </button>
          )}

          {iseViewingSelf && <span> &#xb7;</span>}

          {iseViewingSelf && (
            <button className="cursor-pointer">Edit Profile</button>
          )}
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
