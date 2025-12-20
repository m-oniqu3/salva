"use client";

import Avatar from "@/components/Avatar";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useModal } from "@/context/useModal";
import useFollowStates from "@/hooks/useFollowStates";
import { ModalEnum } from "@/types/modal";
import { Profile } from "@/types/user";
import { toggleFollowUser } from "@utils/api/user/follow-user";
import { useEffect, useState } from "react";

type Props = {
  profile: Profile;
  userID: Profile["user_id"] | null;
};

enum Counts {
  F = "FOLLOWERS",
  FL = "FOLLOWING",
}

type State = Counts;

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

  const { data, refetch } = useFollowStates(userID, profileID);

  // Use local state since we want to manipulate the state locally to acheive 'optimistic' state changes
  const [followCounts, setFollowCounts] = useState<typeof data>(data);

  console.log(followCounts);

  const isLoggedIn = Boolean(userID);

  // Is the current user viewing their own profile?
  const isUserViewingSelf = profileID === userID;

  // Sync local state whenever the query data changes
  useEffect(() => {
    if (data) setFollowCounts(data);
  }, [data]);

  function openLoginModal() {
    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: { type: ModalEnum.A },
    });
  }

  function updateFollowCounts(state: State, increment = false) {
    if (!followCounts) return;

    const obj = Object.assign({}, followCounts);
    const count = increment ? 1 : -1;

    const modifiedObj = (() => {
      switch (state) {
        case Counts.F:
          return Object.assign(obj, {
            followers: obj.followers + count,
            isFollowing: !obj.isFollowing,
          });

        case Counts.FL:
          return obj;

        default:
          return obj;
      }
    })();

    setFollowCounts(modifiedObj);
  }

  /**
   * Handles following or unfollowing a user.
   * If `!loggedIn` open the login modal.
   * Otherwise, immediately update the follow count, then the target user.
   * Refetch the data after following/unfollowing the user.
   */
  async function handleFollowUser() {
    if (!isLoggedIn) return openLoginModal();

    // Optimistically update follower count through local state
    // Following the user? Decrement. Otherwise increment.
    updateFollowCounts(Counts.F, !followCounts?.isFollowing);

    // Toggle follow user & re-fetch follow counts
    const { error } = await toggleFollowUser(profile.user_id);

    if (error) {
      return updateFollowCounts(Counts.F);
    }

    refetch();
  }

  function handleViewFollowers() {
    if (!followCounts?.followers) return;

    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: {
        type: ModalEnum.F,
        payload: { userID, targetUserID: profileID },
      },
    });
  }

  function handleViewFollowing() {
    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: {
        type: ModalEnum.FL,
        payload: { userID, targetUserID: profileID },
      },
    });
  }

  return (
    <section className="py-4 max-w-[450px]">
      <article className="flex flex-col gap-1">
        {/* Avatar */}
        <Avatar
          avatar={avatar}
          username={username}
          className={"size-10 rounded-full text-xl"}
        />

        {/* Name */}
        <div className="mt-2">
          <h2 className="font-semibold text-lg capitalize text-neutral-800">
            {!firstname && <span>{username}</span>}
            <span>{firstname + " " + lastname}</span>
          </h2>
        </div>

        {/* Bio */}
        <p className="text-zinc-500 leading-5 text-[13px]">{bio}</p>

        {/* Follower counts & Following Actions */}
        <div className="flex flex-wrap gap-2 mt-1 font-semibold text-neutral-800 text-xs">
          {/* Username */}
          <p className="">@{username}</p>
          <span>&#xb7;</span>

          {/* Followers Count */}
          <button
            type="button"
            onClick={handleViewFollowers}
            className="font-semibold flex gap-1 cursor-pointer"
          >
            <span>{followCounts?.followers ?? 0}</span>
            <span>
              {followCounts?.followers === 1 ? "Follower" : "Followers"}
            </span>
          </button>

          <span>&#xb7;</span>

          {/* Following Count */}
          <button
            type="button"
            onClick={handleViewFollowing}
            className="cursor-pointer"
          >
            {followCounts?.following ?? 0}&nbsp;Following
          </button>

          {/* Follow Button Status */}
          {!isUserViewingSelf && (
            <>
              <span>&#xb7;</span>
              <button onClick={handleFollowUser} className="cursor-pointer">
                {followCounts?.isFollowing && isLoggedIn
                  ? "Following"
                  : "Follow"}
              </button>
            </>
          )}

          {isUserViewingSelf && isLoggedIn && (
            <>
              <span>&#xb7;</span>
              <button className="cursor-pointer">Edit Profile</button>
            </>
          )}
        </div>
      </article>
    </section>
  );
}

export default ProfileSummary;
