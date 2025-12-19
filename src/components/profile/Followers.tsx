"use client ";

import { CloseIcon, LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import FollowerPreview from "@/components/profile/FollowerPreview";
import { useModal } from "@/context/useModal";
import useFollowers from "@/hooks/useFollowers";
import { ModalEnum } from "@/types/modal";

type Props = { closeModal: () => void };

function Followers(props: Props) {
  const { closeModal } = props;

  const {
    state: { modal },
    stopPropagation,
  } = useModal();

  const modalType = modal?.type;
  const isFollowersModal = modalType === ModalEnum.F;
  const payload = isFollowersModal && modal?.payload ? modal.payload : null;

  const targetUserID = payload?.targetUserID ?? "";

  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useFollowers(targetUserID);

  return (
    <section
      className="panel p-0 pb-6 max-w-sm overflow-y-auto no-scrollbar flex flex-col"
      onClick={stopPropagation}
    >
      <header className="sticky top-0 z-10 p-8 pb-10 bg-white border-b-[1px] border-neutral-50">
        <h1 className="text-lg font-semibold text-neutral-800">Followers</h1>
        <p className="text-sml">Here are your followers.</p>

        <button
          onClick={closeModal}
          className="absolute top-9 right-9 cursor-pointer"
        >
          <CloseIcon className="size-5" />
        </button>
      </header>

      <article className="h-full">
        {/* load */}
        {isLoading && (
          <span className="h-full grid place-items-center">
            <LoadingIcon className="size-5 text-neutral-500" />
          </span>
        )}

        {/* fetch error */}
        {!isLoading && error && (
          <p>Error fetching followers {" " + error.message}</p>
        )}

        {/* no data*/}
        {!isLoading && !error && !data && <p> No data</p>}

        {!isLoading && !!data && (
          <InfiniteScroll
            isLoadingIntialData={isLoading}
            isLoadingMoreData={isFetchingNextPage}
            fetchMoreData={() => hasNextPage && fetchNextPage()}
          >
            <li>
              {data.map((follower) => (
                <FollowerPreview
                  key={follower.id}
                  userID={payload?.userID}
                  follower={follower}
                />
              ))}
            </li>
          </InfiniteScroll>
        )}
      </article>
    </section>
  );
}

export default Followers;
