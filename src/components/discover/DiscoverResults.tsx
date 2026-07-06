"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { discoverFilms } from "@utils/api/films/discover-films-default";
import { usePathname } from "next/navigation";

type Props = {
  defaultFilms: TMDBFilm[] | null;
  genreKey?: string;
  user: UserMeta;
};

function DiscoverResults({ defaultFilms, user, genreKey = "" }: Props) {
  const pathname = usePathname();
  const selectedGenreKey = genreKey ?? pathname.split("/").pop();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["discover", selectedGenreKey],

    queryFn: ({ pageParam }) =>
      discoverFilms({
        genreKey: selectedGenreKey ? +selectedGenreKey : undefined,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,

    initialData:
      !selectedGenreKey && defaultFilms
        ? {
            pages: [{ films: defaultFilms, page: 1, totalPages: 2 }],
            pageParams: [1],
          }
        : undefined,
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
        message="We hit a snag fetching your collections."
        className="error-state-wrapper"
      />
    );
  }

  if (films.length === 0) {
    return (
      <ErrorState
        heading="No matches for this genre right now."
        message="Try mixing it up—your next favorite might be one click away."
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
      <div className="content-grid">
        {films.map((film) => (
          <Film key={`${film.media_type}-${film.id}`} film={film} user={user} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default DiscoverResults;
