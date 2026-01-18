"use client";

import { useQuery } from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";

type Props = {
  userID?: string | null;
  filmID?: number | null;
};

function useGetCollectionsMeta({ userID, filmID }: Props) {
  return useQuery({
    queryKey: ["collection", "meta", userID],
    queryFn: async () => {
      if (!userID || !filmID) throw new Error("Missing argument");

      return getCollectionsMeta({ userID: userID ?? "", filmID });
    },
    enabled: !!userID,
  });
}

export default useGetCollectionsMeta;
