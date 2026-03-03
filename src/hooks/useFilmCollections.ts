import { useQuery } from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getFilmCollections } from "@utils/api/collections/get-film-collections";

type Props = {
  filmID?: number | undefined;
};

function useFilmCollections(props?: Props) {
  const collectionsMetaQuery = useQuery({
    queryKey: ["collection", "meta"],
    queryFn: async () => {
      const { data, error } = await getCollectionsMeta();
      if (error) throw error;
      return data;
    },
  });

  const collectionFilmsQuery = useQuery({
    queryKey: ["collection", "films", props?.filmID],
    queryFn: async () => {
      if (!props?.filmID) throw new Error("No film ID.");

      const { data, error } = await getFilmCollections(props.filmID);
      if (error) throw error;

      return data;
    },
    enabled: !!props?.filmID,
  });

  return { collectionsMetaQuery, collectionFilmsQuery };
}

export default useFilmCollections;
