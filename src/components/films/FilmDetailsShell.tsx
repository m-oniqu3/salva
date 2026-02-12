"use client";

import FilmDetails from "@/components/films/FilmDetails";
import SimilarFilms from "@/components/films/SimilarFilms";
import { ChevronLeftIcon } from "@/components/icons";
import { MediaType, Movie, TVShow } from "@/types/tmdb";
import { type UserMeta } from "@/types/user";
import { FilmWithExtras } from "@utils/api/films/get-film-by-id";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  data: FilmWithExtras<Movie | TVShow>;
  user: UserMeta;
  media_type: MediaType;
};

function FilmDetailsShell(props: Props) {
  const { data, user, media_type } = props;

  const router = useRouter();
  const similarFilmsRef = useRef<HTMLDivElement | null>(null);

  function scrollToTargetSection() {
    if (similarFilmsRef.current) {
      similarFilmsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  const [isIntersecting, setIsIntersecting] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-y-scroll h-full w-full z-50">
      <button
        type="button"
        onClick={router.back}
        className="gray size-8 rounded-full flex-center cursor-pointer fixed top-4 left-4 z-50"
      >
        <ChevronLeftIcon className="size-5" />
      </button>

      <div
        className={`bg-white absolute top-0 left-0 h-[110dvh] w-full   z-30  transition-opacity duration-200 ease-in-out  ${isIntersecting ? "opacity-100 block" : "opacity-0 hidden"}`}
      />

      <div className="h-screen w-screen fixed top-0 left-0 z-20">
        <FilmDetails
          film={data.film}
          credits={data.credits}
          recommendations={data.recommendations}
          media_type={media_type}
          user={user}
          isIntersecting={isIntersecting}
          onScrollToSection={scrollToTargetSection}
        />
      </div>

      <div
        ref={similarFilmsRef}
        className="bg-white pb-20 absolute top-[110dvh] left-0 h-fit w-full z-20 "
      >
        <div ref={triggerRef} className="w-full" />
        <SimilarFilms
          films={data.recommendations.concat(data.similar)}
          user={user}
        />
      </div>
    </div>
  );
}

export default FilmDetailsShell;
