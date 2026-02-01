"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import InfiniteScroll from "@/components/InfiniteScroll";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilms } from "@utils/api/films/get-films";

import { calculateRange } from "@utils/validation/paginate";

type Props = {
  user: { id: string; username: string };
};

function AllFilms(props: Props) {
  const { user } = props;

  const {
    isLoading,
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["all-films", user.id],
    queryFn: ({ pageParam }) =>
      getFilms({
        userID: user?.id,
        range: calculateRange(pageParam, 20),
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data?.length) return undefined;
      return allPages.length;
    },
    enabled: Boolean(user?.id),
  });

  const films = data?.pages
    ? data.pages.flatMap((cur) => {
        if (!cur?.data) return [];
        return cur.data;
      })
    : null;

  if (data?.pages[0]?.error) {
    return (
      <ErrorState
        title="Reel Jammed"
        message="We couldn’t load your saved films. Try again in a moment."
        buttonLabel="Try Again"
        onClick={refetch}
      />
    );
  }

  if (!films || films.length === 0) {
    return (
      <ErrorState
        title="Nothing in the Archives"
        message="Your saved films will appear here once you start collecting."
        buttonLabel="Explore Films"
        link="/"
      />
    );
  }

  const rendered_films = films.map((film, i) => {
    return <Film key={film.id + i} film={film} user={user} />;
  });

  return (
    <InfiniteScroll
      isLoadingIntialData={isLoading}
      isLoadingMoreData={isFetchingNextPage}
      fetchMoreData={() => hasNextPage && fetchNextPage()}
    >
      <div className="content-grid">{rendered_films}</div>
    </InfiniteScroll>
  );
}

export default AllFilms;
