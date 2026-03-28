"use client";

import FilmImage from "@/components/films/FilmImage";
import FilmOverview from "@/components/films/FilmOverview";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: UserMeta;
  credits: Credits;
  recommendations: TMDBFilm[];
  isIntersecting: boolean;
  onScrollToSection: () => void;
};

function FilmDetails(props: Props) {
  return (
    <div className="h-full bg-white wrapper ">
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
