"use client";

import CollectionPreview from "@/components/collection/CollectionPreview";
import ErrorState from "@/components/ErrorState";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCollections } from "@utils/api/collections/get-collections";

type Props = {
  targetUserID: string;
  authUserID: string | null;
};

function Collections(props: Props) {
  const { targetUserID, authUserID } = props;

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["collections", targetUserID],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await getCollections({
        targetUserID,
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
    staleTime: Infinity,
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
      <ErrorState
        heading="Playback error."
        message="We hit a snag fetching your collections."
        className="error-state-wrapper"
      />
    );
  }

  if (!data || data.pages.length === 0) {
    return (
      <ErrorState
        heading="Nothing on screen"
        message={" No collections have been created here yet"}
        className="error-state-wrapper"
      />
    );
  }

  const collections = data?.pages?.flatMap((col) => col ?? []) ?? [];

  //filter out collections
  const viewableCollections = collections.filter((col) => {
    const isCollectionOwner = authUserID === col.user.user_id;
    return isCollectionOwner || !col.collection.is_private;
  });

  return (
    <InfiniteScroll
      isLoadingIntialData={isLoading}
      isLoadingMoreData={isFetchingNextPage}
      fetchMoreData={() => hasNextPage && fetchNextPage()}
    >
      <div className="content-grid">
        {viewableCollections.map((col) => (
          <CollectionPreview key={col.collection.id} preview={col} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default Collections;
