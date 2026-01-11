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
    <Image
      key={id}
      src={poster_path}
      alt={title}
      width={90}
      height={90}
      quality={75}
      className="size-full  object-cover"
    />
  );
}

export default Film;
