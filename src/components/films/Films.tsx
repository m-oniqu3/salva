"use client";

import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { LoadingIcon } from "@/components/icons";
import InfiniteScroll from "@/components/InfiniteScroll";
import useGetFilms from "@/hooks/useGetFilms";
import { UserMeta } from "@/types/user";

type Props = {
  user: UserMeta;
  targetUser: { userID: string; collectionID?: number };
};

function Films(props: Props) {
  const { user, targetUser } = props;

  const {
    isLoading,
    data,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetFilms({
    userID: targetUser.userID,
    collectionID: targetUser.collectionID,
  });

  const isCollectionOwner = user?.userID === targetUser.userID;

  if (isLoading) {
    return (
      <div className="flex-center w-full">
        <LoadingIcon className="size-5 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="Reel Jammed"
          message={
            isCollectionOwner
              ? "We couldn’t load your saved films. Try again in a moment."
              : "Couldn't load films."
          }
          buttonLabel="Try Again"
          onClick={refetch}
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="error-state-wrapper">
        <ErrorState
          heading="Nothing in the Archives"
          message={
            isCollectionOwner
              ? "Saved films will appear here once you start collecting."
              : "Nothing saved here yet."
          }
        />
      </div>
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

export default Films;
