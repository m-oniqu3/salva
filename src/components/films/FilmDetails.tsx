import { MediaType, Movie, TVShow } from "@/types/tmdb";
import Image from "next/image";

type Props = {
  film: Movie | TVShow;
  media_type: MediaType;
};

function FilmDetails(props: Props) {
  const { film } = props;

  return (
    <div className="h-full bg-amber-200">
      <figure className="bg-blue-300 w-full max-w-80  m-auto ">
        <Image
          src={film.poster_path ?? ""}
          alt={"title" in film ? film.title : film.name}
          width={100}
          height={100}
          className="object-cover size-full"
        />
      </figure>
    </div>
  );
}

export default FilmDetails;
