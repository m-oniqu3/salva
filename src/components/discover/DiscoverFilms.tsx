"use client";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { CloseIcon, LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useInfiniteQuery } from "@tanstack/react-query";
import { defaultDiscoverFilms } from "@utils/api/films/discover-films-default";
import { TMDB_GENRE_MAP } from "@utils/tmdb-genres";
import { useState } from "react";

type Props = {
  defaultFilms: TMDBFilm[] | null;
  user: UserMeta;
};

function DiscoverFilms(props: Props) {
  const { defaultFilms, user } = props;

  const [selectedGenreKey, setSelectedGenreKey] = useState("");

  function handleGenre(key: string) {
    setSelectedGenreKey(key);
  }

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
      defaultDiscoverFilms({
        genreKey: selectedGenreKey ? +selectedGenreKey : undefined,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,

    // Skip the initial network request when there's no genre filter
    // by seeding the cache with the server-fetched films.
    initialData:
      !selectedGenreKey && defaultFilms
        ? {
            pages: [{ films: defaultFilms, page: 1, totalPages: 2 }],
            pageParams: [1],
          }
        : undefined,
  });

  const films = data?.pages.flatMap((p) => p.films) ?? [];

  console.log(films);

  // useEffect(() => {
  //   const node = loadMoreRef.current;
  //   if (!node) return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
  //         fetchNextPage();
  //       }
  //     },
  //     { rootMargin: "400px" },
  //   );

  //   observer.observe(node);
  //   return () => observer.disconnect();
  // }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
        heading="Our projector stopped working."
        message="We couldn't load any films right now. Try refreshing the page."
        className="error-state-wrapper"
      />
    );
  }

  return (
    <section className="pages">
      <ul className="flex flex-wrap gap-4">
        {Object.entries(TMDB_GENRE_MAP).map(([key, genre]) => {
          return (
            <li
              key={key}
              className={`text-xs font-semibold  p-3 h-9 rounded-full cursor-pointer flex items-center justify-center ${selectedGenreKey === key ? "bg-neutral-800 text-white opacity-100" : "opacity-50 gray"}`}
              onClick={() => handleGenre(key)}
            >
              {genre}
            </li>
          );
        })}

        {selectedGenreKey && (
          <Button
            className="gray opacity-50 hover:bg-neutral-800 hover:text-white hover:opacity-100"
            onClick={() => setSelectedGenreKey("")}
          >
            <CloseIcon className="size-4" />
          </Button>
        )}
      </ul>

      <section className="flex flex-col gap-4">
        {films.length > 0 ? (
          <InfiniteScroll
            isLoadingIntialData={isLoading}
            isLoadingMoreData={isFetchingNextPage}
            fetchMoreData={() => hasNextPage && fetchNextPage()}
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
        ) : (
          <ErrorState
            heading="No matches for this genre right now."
            message="Try mixing it up—your next favorite might be one click away."
            className="error-state-wrapper"
          />
        )}
      </section>
    </section>
  );
}

export default DiscoverFilms;
