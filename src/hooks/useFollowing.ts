import { useInfiniteQuery } from "@tanstack/react-query";
import { getFollowing } from "@utils/api/user/get-following";

function useFollowings(targetUserID: string) {
  const {
    isLoading,
    error,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isRefetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["get-followings", targetUserID],
    queryFn: ({ pageParam }) => getFollowing({ targetUserID, page: pageParam }),

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
    isRefetching,
    refetch,
  };
}

export default useFollowings;
