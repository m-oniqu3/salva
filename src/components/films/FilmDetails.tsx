"use client";

import Film from "@/components/films/Film";
import FilmOverview from "@/components/films/FilmOverview";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import Image from "next/image";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: { id: string; username: string } | null;
  credits: Credits;
  recommendations: TMDBFilm[];
  isIntersecting: boolean;
};

function FilmDetails(props: Props) {
  const { film, media_type, user, isIntersecting } = props;
  const title = "title" in film ? film.title : film.name;

  return (
    <div className="h-full bg-white">
      <div className="grid h-full lg:grid-cols-[1fr_auto]">
        <div className="h-full wrapper flex flex-col items-center ">
          {/* <div
            className={`absolute h-full inset-0  blur-2xl transition-colors duration-100 ease-in-out  ${isIntersecting ? "bg-white" : "bg-[linear-gradient(to_left,white_0%,white_70%,transparent_100%)]"}`}
          /> */}

          {!isIntersecting && (
            <Image
              src={film.backdrop_path}
              alt={title}
              width={100}
              height={100}
              quality={75}
              className={`absolute top-0 left-0 z-5 opacity-15 object-cover size-full blur-2xl }`}
            />
          )}

          <div
            className={`h-full w-full max-w-80 flex-center z-10 transition-transform duration-700 ease-out ${isIntersecting ? "opacity-0 -translate-y-15 pointer-events-none" : "opacity-100  translate-y-0"}`}
          >
            <Film
              film={{
                id: film.id,
                title: title,
                poster_path: film.poster_path!,
                media_type,
              }}
              user={user}
            />
          </div>

          <div>
            <button className="capitalize">view similar</button>
          </div>
        </div>

        <div
          className={`hidden lg:flex justify-end w-full z-10 transition-transform duration-700 ease-out ${isIntersecting ? "opacity-0 pointer-events-none" : "opacity-100 "}`}
        >
          <FilmOverview {...props} />
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default FilmDetails;
