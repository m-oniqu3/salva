"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { UserMeta } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllFilms } from "@utils/api/films/get-all-films";
import { calculateRange } from "@utils/validation/paginate";

type Props = {
  user: UserMeta;
};

function AllFilms(props: Props) {
  const { user } = props;

  console.log(user);

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["films"],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await getAllFilms({
        range: calculateRange(pageParam, 10),
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

  const films = data?.pages?.flatMap((f) => f ?? []) ?? [];

  return (
    <InfiniteScroll
      isLoadingIntialData={isLoading}
      isLoadingMoreData={isFetchingNextPage}
      fetchMoreData={() => hasNextPage && fetchNextPage()}
    >
      <div className="content-grid">
        {films?.map((film) => (
          <Film key={film.id} film={film} user={user} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default AllFilms;
