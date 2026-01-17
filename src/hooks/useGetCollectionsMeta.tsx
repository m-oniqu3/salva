"use client";

import { useQuery } from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";

type Props = {
  userID?: string | null;
};

function useGetCollectionsMeta({ userID }: Props) {
  return useQuery({
    queryKey: ["collection", "meta", userID],
    queryFn: async () => {
      // if (!userID) throw new Error("No user ID");
      return getCollectionsMeta({ userID: userID ?? "" });
    },
    enabled: !!userID,
  });
}

export default useGetCollectionsMeta;
