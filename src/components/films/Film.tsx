import FilmMeta from "@/components/films/FilmMeta";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";
import { getTMDBImageURL } from "@utils/get-cover-url";
import Image from "next/image";

type Props = {
  film: TMDBFilm;
  user: UserMeta;
};

function Film(props: Props) {
  const {
    film,
    film: { id, title, poster_path },
    user,
  } = props;

  const isAuth = !!user?.userID;
  const url = getTMDBImageURL(poster_path);

  return (
    <div className="w-full">
      <figure className="group relative size-full">
        <Image
          key={id}
          src={url}
          alt={title}
          width={90}
          height={90}
          quality={75}
          className="size-full object-cover gray"
        />

        {isAuth && <FilmMeta film={film} user={user} />}
      </figure>
    </div>
  );
}

export default Film;
