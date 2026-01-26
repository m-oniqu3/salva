"use client";

import FilmMeta from "@/components/films/FilmMeta";
import FilmOverview from "@/components/films/FilmOverview";
import { ChevronLeftIcon } from "@/components/icons";
import { MediaType, Movie, TVShow } from "@/types/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
  user: { id: string; username: string } | null;
};

function FilmDetails(props: Props) {
  const { film, media_type, user } = props;
  const isAuth = !!user?.id;

  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 h-screen w-screen z-10 bg-white">
      <div>
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="gray size-8 rounded-full flex-center cursor-pointer fixed top-4 left-4 z-10"
        >
          <ChevronLeftIcon className="size-5" />
        </button>
      </div>

      <div className="grid h-full lg:grid-cols-[1fr_auto]">
        <div className="size-full grid place-items-center  ">
          <div className="absolute h-full inset-0 bg-[linear-gradient(to_left,white_0%,white_70%,transparent_100%)] blur-2xl" />

          <Image
            src={film.backdrop_path ?? ""}
            alt={"title" in film ? film.title : film.name}
            width={100}
            height={100}
            quality={75}
            className="absolute top-0 left-0 z-5 opacity-15 object-cover size-full  blur-2xl"
          />

          <figure className="w-full max-w-80 group relative z-10">
            <Image
              src={film.poster_path ?? ""}
              alt={"title" in film ? film.title : film.name}
              width={100}
              height={100}
              quality={75}
              className="object-cover size-full"
            />

            {isAuth && (
              <FilmMeta
                film={{
                  id: film.id,
                  title: "title" in film ? film.title : film.name,
                  poster_path: film.poster_path!,
                  media_type,
                }}
                user={user}
              />
            )}
          </figure>
        </div>

        <div className="hidden lg:flex justify-end w-full z-10">
          <FilmOverview {...props} />
        </div>
      </div>

      <div></div>
    </div>
  );
}

export default FilmDetails;
