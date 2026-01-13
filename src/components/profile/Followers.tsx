"use client ";

import { CloseIcon, LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import FollowerSummary from "@/components/profile/FollowerSummary";
import { useModal } from "@/context/useModal";
import useFollowers from "@/hooks/useFollowers";
import { ModalEnum } from "@/types/modal";
import { useQueryClient } from "@tanstack/react-query";

function Followers() {
  const {
    state: { modal },
    closeModal,
    stopPropagation,
  } = useModal();
  const qc = useQueryClient();

  const isFollowersModal = modal?.type === ModalEnum.F;
  const payload = isFollowersModal && modal?.payload ? modal.payload : null;

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
  } = useFollowers(targetUserID);

  const renderedContent = (() => {
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

    const invalidateQueries = () => {
      return Promise.all([
        qc.invalidateQueries({
          queryKey: ["follow", "followers", targetUserID],
          refetchType: "none",
        }),
        qc.invalidateQueries({
          queryKey: ["follow", "states", targetUserID],
        }),
      ]);
    };

    return (
      <InfiniteScroll
        isLoadingIntialData={isLoading}
        isLoadingMoreData={isFetchingNextPage}
        fetchMoreData={() => hasNextPage && fetchNextPage()}
      >
        <ul className="list-none">
          {data.map((follower) => (
            <FollowerSummary
              key={follower.id}
              userID={userID}
              follower={follower}
              isFollowingText="Following"
              refreshFollowData={invalidateQueries}
            />
          ))}
        </ul>
      </InfiniteScroll>
    );
  })();

  return (
    <section
      className="panel p-0 pb-6 max-w-sm overflow-y-auto no-scrollbar flex flex-col"
      onClick={stopPropagation}
    >
      <header className="sticky p-8 top-0 z-10 bg-white">
        <h1 className="text-lg font-semibold text-neutral-800">Followers</h1>
        <p className="text-sml">People who follow this user.</p>

        <button
          onClick={closeModal}
          className="absolute top-8 right-8 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <article className="h-full">{renderedContent}</article>
    </section>
  );
}

export default Followers;
