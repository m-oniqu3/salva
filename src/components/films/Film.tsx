import FilmMeta from "@/components/films/FilmMeta";
import { CollectionMeta } from "@/types/collection";
import { TMDBFilm } from "@/types/tmdb";
import Image from "next/image";

type Props = {
  film: TMDBFilm;
  userID: string | null;
  collectionMeta: CollectionMeta | null;
};

function Film(props: Props) {
  const {
    film,
    film: { id, title, poster_path },
    userID,
    collectionMeta,
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

      {userID && (
        <FilmMeta film={film} collectionMeta={collectionMeta} userID={userID} />
      )}
    </figure>
  );
}

export default Film;
