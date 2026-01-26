import FilmMeta from "@/components/films/FilmMeta";
import { TMDBFilm } from "@/types/tmdb";
import Image from "next/image";

type Props = {
  film: TMDBFilm;
  user: { id: string; username: string } | null;
};

async function Film(props: Props) {
  const {
    film,
    film: { id, title, poster_path },
    user,
  } = props;

  const isAuth = !!user;

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

      {isAuth && <FilmMeta film={film} user={user} />}
    </figure>
  );
}

export default Film;
