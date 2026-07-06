"use client";

import CollectionPreview from "@/components/collection/CollectionPreview";
import ErrorState from "@/components/ErrorState";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getTopCollections } from "@utils/api/collections/get-top-collections";
import { calculateRange } from "@utils/validation/paginate";

function DiscoverCollections() {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["collections", "discover"],

    queryFn: async ({ pageParam }) => {
      const { data, error } = await getTopCollections({
        range: calculateRange(pageParam, 20),
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

  // todo: fix error msg
  if (error) {
    return (
      <ErrorState
        heading="Playback error."
        message="We hit a snag fetching your collections."
        className="error-state-wrapper"
      />
    );
  }

  const collections = data?.pages
    ? data.pages.flatMap((cur) => {
        if (!cur) return [];
        return cur;
      })
    : null;
  // console.log(data);

  return (
    <section className="flex flex-col gap-4">
      <InfiniteScroll
        isLoadingIntialData={isLoading}
        isLoadingMoreData={isFetchingNextPage}
        fetchMoreData={() => hasNextPage && fetchNextPage()}
      >
        <div className="content-grid">
          {collections?.map((col) => (
            <CollectionPreview
              key={col.collection.id}
              preview={col}
              showAvatar
            />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}

export default DiscoverCollections;
