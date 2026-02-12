"use client";

import CollectionPreview from "@/components/collection/CollectionPreview";
import ErrorState from "@/components/ErrorState";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCollections } from "@utils/api/collections/get-collections";

type Props = {
  username: string;
  isCollectionOwner: boolean;
};

function Collections(props: Props) {
  const { username, isCollectionOwner } = props;

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["collections", username],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await getCollections({
        username,
        page: pageParam,
      });

      if (error) throw error;

      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.length) return undefined;
      return allPages.length;
    },
  });

  if (isLoading) {
    return (
      <div className="error-state-wrapper">
        <LoadingIcon className="size-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="Playback error."
          message="We hit a snag fetching your collections."
        />
      </div>
    );
  }

  if (!data || data.pages.length === 0) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="Nothing on screen"
          message={
            isCollectionOwner
              ? `You haven’t created any collections yet.`
              : `This user hasn’t shared any collections yet`
          }
        />
      </div>
    );
  }

  const collections = data?.pages?.flatMap((col) => col ?? []) ?? [];

  //filter out collections
  const viewableCollections = collections.filter((col) => {
    return isCollectionOwner || !col.is_private;
  });

  const rendered_previews = viewableCollections.map((col) => {
    return (
      <CollectionPreview
        key={col.id}
        username={username}
        preview={{
          ...col,
          // cover_image: `https://picsum.photos/id/${col.id}/500/500`,
        }}
      />
    );
  });

  return (
    <InfiniteScroll
      isLoadingIntialData={isLoading}
      isLoadingMoreData={isFetchingNextPage}
      fetchMoreData={() => hasNextPage && fetchNextPage()}
    >
      <div className="content-grid">{rendered_previews}</div>
    </InfiniteScroll>
  );
}

export default Collections;
