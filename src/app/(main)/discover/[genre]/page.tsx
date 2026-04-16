"use client";

import ErrorState from "@/components/ErrorState";
import { LoadingIcon } from "@/components/icons";
import { useQuery } from "@tanstack/react-query";
import { defaultDiscoverFilms } from "@utils/api/films/discover-films-default";
import { usePathname } from "next/navigation";

function GenreFilms() {
  const pathname = usePathname();
  const genre = pathname.split("/").pop();
  console.log("discover");

  const { data, error, isLoading } = useQuery({
    queryKey: ["discover", "default"],
    queryFn: defaultDiscoverFilms,
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

  console.log(data);

  if (!genre) return <p>no genre</p>;

  return <div>{genre}</div>;
}

export default GenreFilms;
