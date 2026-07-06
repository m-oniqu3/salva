"use client";

import FilmDetailsHeader from "@/components/films/FilmDetailsHeader";
import FilmImage from "@/components/films/FilmImage";
import FilmOverview from "@/components/films/FilmOverview";
import { Credits, MediaType, Movie, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: UserMeta;
  credits: Credits;
  isIntersecting: boolean;
  onScrollToSection: () => void;
};

function FilmDetails(props: Props) {
  return (
    <div className="h-full bg-white wrapper ">
      <FilmDetailsHeader {...props} />

      <div className="grid h-full lg:grid-cols-[1fr_1fr] ">
        <FilmImage {...props} />

        <div className={`hidden h-full lg:flex`}>
          <FilmOverview {...props} />
        </div>
      </div>
    </div>
  );
}

export default FilmDetails;
