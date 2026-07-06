"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { UserMeta } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { searchFilms } from "@utils/api/films/search-films";

type Props = {
  query: string;
  user: UserMeta;
};

function SearchFilms({ query, user }: Props) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["search", query],
    queryFn: ({ pageParam }) => searchFilms(query, pageParam),

    initialPageParam: 0,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const films = data?.pages.flatMap((p) => p.films) ?? [];

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
        message="We hit a snag searching."
        className="error-state-wrapper"
      />
    );
  }

  if (films.length === 0) {
    return (
      <ErrorState
        heading="No matches found."
        message="Try a different search term."
        className="error-state-wrapper"
      />
    );
  }

  return (
    <>
      <InfiniteScroll
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={!!hasNextPage}
        fetchNextPage={fetchNextPage}
      >
        <div className="content-grid">
          {films.map((film) => (
            <Film
              key={`${film.media_type}-${film.id}`}
              film={film}
              user={user}
            />
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
}

export default SearchFilms;
