"use client";

import Avatar from "@/components/Avatar";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useModal } from "@/context/useModal";
import useFollow from "@/hooks/useFollow";
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

  const { data, refresh } = useFollow(userID, profileID);
  const { followers, following, isFollowing } = data ?? {
    followers: 0,
    following: 0,
    isFollowing: false,
  };

  // Is the current user viewing their own profile?
  const isViewingSelf = profileID === userID;

  /**
   * Handles following or unfollowing a user.
   *
   * Uses the `userID` to determine is a current user is present. (Is there a session present? Is the user logged in?)
   *
   * Follow the target user if logged in, otherwise prompt the user to log in.
   */
  async function handleFollowUser() {
    console.log("handling follow user");
    // If no user, prompt user to log in
    if (!userID) {
      return dispatch({
        type: ModalActionEnum.OPEN_MODAL,
        payload: ModalEnum.A,
      });
    }

    const { error } = await toggleFollowUser(profile.user_id);
    if (!error) refresh(); // re-fetch follow counts
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

          <p className="font-semibold flex gap-1">
            <span>{followers}</span>
            <span>{followers === 1 ? "Follower" : "Followers"}</span>
          </p>

          <span>&#xb7;</span>

          <p>{following}&nbsp;Following</p>

          {!isViewingSelf && <span>&#xb7;</span>}

          {!isViewingSelf && (
            <button onClick={handleFollowUser} className="cursor-pointer">
              {isFollowing && userID ? "Following" : "Follow"}
            </button>
          )}

          {isViewingSelf && <span> &#xb7;</span>}

          {isViewingSelf && (
            <button className="cursor-pointer">Edit Profile</button>
          )}
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
