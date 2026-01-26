import FilmMeta from "@/components/films/FilmMeta";
import { TMDBFilm } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";

type Props = {
  film: TMDBFilm;
  user: { id: string; username: string } | null;
};

async function Film(props: Props) {
  const {
    film,
    film: { id, title, poster_path, media_type },
    user,
  } = props;

  const isAuth = !!user;

  return (
    <Link href={`/film/${media_type}/${id}`}>
      <figure className="group relative h-full">
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
    </Link>
  );
}

export default Film;
