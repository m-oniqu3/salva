"use client";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import FollowingUserSummary from "@/components/profile/FollowingUserSummary";
import { useModal } from "@/context/useModal";
import useFollowings from "@/hooks/useFollowing";
import { ModalEnum } from "@/types/modal";

/**
 * Displays the users the current user is following.
 * Fetches the users and displays a summary.
 * Allows the user to update the follow status - unfollow/follow the followed user.
 */
function FollowingPeople() {
  const {
    state: { modal },
  } = useModal();
  const isFollowingsModal = modal?.type === ModalEnum.FL;
  const payload = isFollowingsModal && modal?.payload ? modal.payload : null;

  const { targetUserID, userID } = payload ?? {
    targetUserID: "",
    userID: null,
  };

  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFollowings(targetUserID);

  if (isLoading) {
    return (
      <div className="h-full grid place-items-center">
        <LoadingIcon className="size-5 text-neutral-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full grid place-items-center px-4">
        <div className="text-center">
          <p className="text-neutral-700 font-medium">
            Failed to load followers
          </p>
          <p className="text-sm text-neutral-500 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full grid place-items-center px-4">
        <p className="text-neutral-500 text-sm">No followers yet</p>
      </div>
    );
  }

  const renderedFollowers = data.map((follower) => (
    <FollowingUserSummary
      key={follower.id}
      userID={userID}
      follower={follower}
    />
  ));

  return (
    <InfiniteScroll
      isLoadingIntialData={isLoading}
      isLoadingMoreData={isFetchingNextPage}
      fetchMoreData={() => hasNextPage && fetchNextPage()}
    >
      <ul className="list-none">{renderedFollowers}</ul>
    </InfiniteScroll>
  );
}

export default FollowingPeople;
