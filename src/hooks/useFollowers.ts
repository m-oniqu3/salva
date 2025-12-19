import { useInfiniteQuery } from "@tanstack/react-query";
import { getFollowers } from "@utils/api/user/get-followers";

function useFollowers(targetUserID: string) {
  console.log("calling useFollowers", targetUserID);

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
    queryKey: ["get-followers", targetUserID],
    queryFn: ({ pageParam }) => getFollowers({ targetUserID, page: pageParam }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data?.length) return undefined;
      return allPages.length;
    },
    enabled: Boolean(targetUserID),
  });

  console.log("called useFollowers and got some data");
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

export default useFollowers;
