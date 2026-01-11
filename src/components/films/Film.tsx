import { AddIcon, ChevronDownIcon } from "@/components/icons";
import { TMDBFilm } from "@/types/tmdb";
import Image from "next/image";

type Props = {
  film: TMDBFilm;
};

function Film(props: Props) {
  const {
    film: { id, title, poster_path },
  } = props;

  return (
    <figure className="group relative">
      <Image
        key={id}
        src={poster_path}
        alt={title}
        width={90}
        height={90}
        quality={75}
        className="size-full object-cover gray"
      />

      <div className="absolute inset-0 bg-neutral-700/40 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-0 left-0 w-full h-full p-4 grid grid-rows-[auto_1fr] opacity-0 group-hover:opacity-100">
        <div className="grid grid-cols-[auto_40px] gap-2">
          <p className="self-center flex items-center gap-2 line-clamp-1">
            <span className="flex-center font-semibold text-white line-clamp-1">
              comfort shows
            </span>
            <span className="flex-center">
              <ChevronDownIcon className="size-5 text-white" />
            </span>
          </p>

          <button className="bg-white text-neutral-800 rounded-full size-10 grid place-items-center">
            <AddIcon className="size-5" />
          </button>
        </div>

        <p className="font-semibold text-white line-clamp-3 self-end">
          {title}
        </p>
      </div>
    </figure>
  );
}

export default Film;
