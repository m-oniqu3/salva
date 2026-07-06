"use client";

import CollectionPreview from "@/components/collection/CollectionPreview";
import ErrorState from "@/components/ErrorState";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import { findCollections } from "@utils/api/collections/find-collections";
import { calculateRange } from "@utils/validation/paginate";

type Props = {
  searchQuery: string;
};

function CollectionResults(props: Props) {
  const { searchQuery } = props;

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["collections"],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await findCollections({
        range: calculateRange(pageParam, 10),
        query: searchQuery,
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
        message="We hit a snag fetching the collections."
        className="error-state-wrapper"
      />
    );
  }

  const collections = data?.pages?.flatMap((f) => f ?? []) ?? [];

  return (
    <InfiniteScroll
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      fetchNextPage={fetchNextPage}
    >
      <div className="content-grid">
        {collections.map((col) => (
          <CollectionPreview key={col.collection.id} preview={col} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default CollectionResults;
