"use client";

import { useQuery } from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";

type Props = {
  filmID?: number | null;
};

function useGetCollectionsMeta({ filmID }: Props) {
  return useQuery({
    queryKey: ["collection", "meta"],
    queryFn: async () => {
      if (!filmID) throw new Error("Film ID is not present");

      return getCollectionsMeta(filmID);
    },
    enabled: !!filmID,
  });
}

export default useGetCollectionsMeta;
