"use client";

import Button from "@/components/Button";
import ErrorState from "@/components/ErrorState";
import Film from "@/components/films/Film";
import { CloseIcon, LoadingIcon } from "@/components/icons";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
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
    data: genreFilms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["discover", selectedGenreKey],
    queryFn: () => defaultDiscoverFilms({ genreKey: +selectedGenreKey }),
    // enabled: !!selectedGenreKey,
  });

  if (isLoading) {
    return (
      <div className="error-state-wrapper">
        <LoadingIcon className="size-5 animate-spin" />
      </div>
    );
  }

  // todo: fix error msg
  if (error) {
    return (
      <ErrorState
        heading="Playback error."
        message="We hit a snag fetching your collections."
        className="error-state-wrapper"
      />
    );
  }

  console.log(defaultFilms);

  return (
    <section className="pages">
      <ul className="flex flex-wrap gap-8">
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
        <h3 className="font-medium">Films</h3>

        {/* {selectedGenreKey} */}
        {!selectedGenreKey ? (
          <div className="content-grid">
            {(defaultFilms ?? [])?.map((film) => {
              return <Film key={film.id} film={film} user={user} />;
            })}
          </div>
        ) : genreFilms && genreFilms?.length > 0 ? (
          <div className="content-grid">
            {genreFilms?.map((film) => {
              return <Film key={film.id} film={film} user={user} />;
            })}
          </div>
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
