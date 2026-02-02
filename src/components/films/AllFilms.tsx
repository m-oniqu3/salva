"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import useAllFilms from "@/hooks/useAllFilms";

type Props = {
  user: { id: string; username: string } | null;
  target: { userID: string; collectionID?: number };
};

function AllFilms(props: Props) {
  const { user, target } = props;

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useAllFilms({
    userID: target.userID,
    collectionID: target.collectionID,
  });

  if (isLoading) {
    return (
      <div className="flex-center w-full">
        <LoadingIcon className="size-5" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Reel Jammed"
        message="We couldn’t load your saved films. Try again in a moment."
        buttonLabel="Try Again"
        onClick={refetch}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <ErrorState
        title="Nothing in the Archives"
        message="Your saved films will appear here once you start collecting."
      />
    );
  }

  const rendered_films = data.map((film) => {
    const tmdbFilm = { ...film, id: film.filmID };
    return <Film key={film.id} film={tmdbFilm} user={user} />;
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
