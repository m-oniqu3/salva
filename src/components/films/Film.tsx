import FilmMeta from "@/components/films/FilmMeta";
import { MostRecentCollection } from "@/types/collection";
import { TMDBFilm } from "@/types/tmdb";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import Image from "next/image";

type Props = {
  film: TMDBFilm;
  userID: string | null;
  mostRecentCollection: MostRecentCollection | null;
};

async function Film(props: Props) {
  const queryClient = new QueryClient();

  const {
    film,
    film: { id, title, poster_path },
    userID,
    mostRecentCollection,
  } = props;

  await queryClient.prefetchQuery({
    queryKey: ["collection", "meta", id],
    queryFn: () => getCollectionsMeta(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
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
          <FilmMeta
            film={film}
            mostRecentCollection={mostRecentCollection}
            userID={userID}
          />
        )}
      </figure>
    </HydrationBoundary>
  );
}

export default Film;
