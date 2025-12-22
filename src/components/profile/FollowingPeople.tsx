"use client";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import FollowerPreview from "@/components/profile/FollowerPreview";
import useFollowings from "@/hooks/useFollowing";

type Props = {
  userID: string | null;
  targetUserID: string;
};

function FollowingPeople(props: Props) {
  const { userID, targetUserID } = props;

  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
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

  const renderedFollowers = data.map((follower) => {
    return (
      <FollowerPreview
        key={follower.id}
        userID={userID}
        follower={follower}
        isRefetching={isRefetching}
        refetch={refetch}
      />
    );
  });

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
