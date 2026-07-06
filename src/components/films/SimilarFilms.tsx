"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import InfiniteScroll from "@/components/InfiniteScroll";
import { MediaType } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSimilarFilms } from "@utils/api/films/get-similar-films";

type Props = {
  media_type: MediaType;
  filmID: number;
  user: UserMeta;
};

function SimilarFilms({ media_type, filmID, user }: Props) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["similar", media_type, filmID],

    queryFn: ({ pageParam }) => getSimilarFilms(media_type, filmID, pageParam),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const films = data?.pages.flatMap((p) => p.films) ?? [];

  if (isError) {
    return (
      <ErrorState
        heading="Couldn't load similar titles."
        message="Something went wrong on our end—try refreshing the page."
        className="error-state-wrapper"
      />
    );
  }

  if (!isLoading && films.length === 0) {
    return (
      <ErrorState
        heading="Nothing similar to show yet."
        message="We couldn't find any recommendations for this title."
        className="error-state-wrapper"
      />
    );
  }

  return (
    <InfiniteScroll
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={!!hasNextPage}
      fetchNextPage={fetchNextPage}
    >
      <div id="similar-films" className="wrapper content-grid">
        {films.map((film) => (
          <Film key={`${film.media_type}-${film.id}`} film={film} user={user} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default SimilarFilms;
