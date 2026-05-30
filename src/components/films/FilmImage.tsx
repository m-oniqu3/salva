"use client";

import Film from "@/components/films/Film";
import { MediaType, Movie, TVShow } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { getTMDBImageURL } from "@utils/get-cover-url";
import { useRouter } from "next/navigation";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: UserMeta;
  onScrollToSection: () => void;
  isIntersecting: boolean;
};

function FilmImage(props: Props) {
  const { film, media_type, user, isIntersecting, onScrollToSection } = props;
  const title = "title" in film ? film.title : film.name;

  const router = useRouter();

  return (
    <section className="h-full flex flex-col items-center ">
      {/* 
          <div
            className={`absolute h-full inset-0  blur-2xl transition-colors duration-100 ease-in-out  ${isIntersecting ? "bg-white" : "bg-[linear-gradient(to_left,white_0%,white_70%,transparent_100%)]"}`}
          /> */}

      {/* {!isIntersecting && (
            <Image
              src={film.backdrop_path}
              alt={title}
              width={100}
              height={100}
              quality={75}
              className={`absolute top-0 left-0 z-5 opacity-15 object-cover size-full blur-3xl }`}
            />
          )} */}

      <div
        className={`h-full w-full max-w-96 grid place-items-center content-start gap-20 z-10 transition-transform duration-300 ease-in-out ${isIntersecting ? "opacity-0 pointer-events-none" : "opacity-100 "}`}
      >
        <div className="w-full max-w-80 py-12">
          <Film
            film={{
              id: film.id,
              title: title,
              poster_path: getTMDBImageURL(film.poster_path!),
              media_type,
            }}
            user={user}
          />
        </div>
        {/* <div className=" h-full">
          {buttons.map(({ name, handler }) => {
            return (
              <Button
                key={name}
                onClick={handler}
                className={`flex items-center gap-2 text-sml font-semibold cursor-pointer bg-neutral-800 text-white`}
              >
                <span className="w-full">{name}</span>

                <span>
                  <ChevronDownIcon className="size-4.5" />
                </span>
              </Button>
            );
          })}
          </div> */}
      </div>
    </section>
  );
}

export default FilmImage;
