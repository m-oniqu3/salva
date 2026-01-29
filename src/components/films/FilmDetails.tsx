"use client";

import Film from "@/components/films/Film";
import FilmOverview from "@/components/films/FilmOverview";
import { ChevronDownIcon } from "@/components/icons";
import { Credits, MediaType, Movie, TMDBFilm, TVShow } from "@/types/tmdb";
import Image from "next/image";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: { id: string; username: string } | null;
  credits: Credits;
  recommendations: TMDBFilm[];
  isIntersecting: boolean;
  onScrollToSection: () => void;
};

function FilmDetails(props: Props) {
  const {
    film,
    media_type,
    user,
    recommendations,
    isIntersecting,
    onScrollToSection,
  } = props;
  const title = "title" in film ? film.title : film.name;

  const rendered_recommendations = recommendations.slice(0, 5).map((rec) => {
    return (
      <figure key={rec.id}>
        <Image
          src={rec.poster_path}
          alt={rec.title}
          width={50}
          height={50}
          className="w-5 object-cover transition-transform duration-200 ease-in-out hover:scale-110"
        />
      </figure>
    );
  });

  return (
    <div className="h-full bg-white">
      <div className="grid h-full lg:grid-cols-[1fr_auto]">
        <div className="h-full wrapper flex flex-col items-center ">
          <div
            className={`absolute h-full inset-0  blur-2xl transition-colors duration-100 ease-in-out  ${isIntersecting ? "bg-white" : "bg-[linear-gradient(to_left,white_0%,white_70%,transparent_100%)]"}`}
          />

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
            className={`h-full w-full max-w-72 flex-center z-10 transition-transform duration-300 ease-in-out ${isIntersecting ? "opacity-0 pointer-events-none" : "opacity-100 "}`}
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

          <div
            className={`flex flex-col gap-2 items-center justify-center w-full py-8 z-10 transition-transform duration-300 ease-in-out ${isIntersecting ? "opacity-0 pointer-events-none" : "opacity-100 "}`}
          >
            <div className="flex gap-2">{rendered_recommendations}</div>

            <button
              onClick={onScrollToSection}
              className="capitalize cursor-pointer text-sml font-semibold flex gap-2 items-center"
            >
              view similar
              <ChevronDownIcon className="size-5" />
            </button>
          </div>
        </div>

        <div
          className={`hidden lg:flex justify-end w-full z-10 transition-transform duration-300 ease-out ${isIntersecting ? "opacity-0 pointer-events-none" : "opacity-100 "}`}
        >
          <FilmOverview {...props} />
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default FilmDetails;
