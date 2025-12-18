import { useInfiniteQuery } from "@tanstack/react-query";
import { getFollowers } from "@utils/api/user/get-followers";

function useFollowers(targetUserID: string) {
  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["get-followers", targetUserID],
    queryFn: ({ pageParam }) => getFollowers({ targetUserID, page: pageParam }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data?.length) return undefined;
      return allPages.length;
    },
    enabled: Boolean(targetUserID),
  });

  const profiles = data?.pages
    ? data.pages.flatMap((cur) => {
        if (!cur.data) return [];
        return cur.data;
      })
    : null;

  return {
    isLoading,
    error,
    data: profiles,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  };
}

export default useFollowers;
