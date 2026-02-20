"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilms } from "@utils/api/films/get-films";
import { calculateRange } from "@utils/validation/paginate";

type Props = {
  userID: string;
  limit?: number;
  collectionID?: number;
};

function useGetFilms(props: Props) {
  const { userID, limit = 20, collectionID } = props;

  const query = useInfiniteQuery({
    queryKey: ["films", collectionID ?? "", userID],
    queryFn: async ({ pageParam }) => {
      if (!userID) throw new Error("Not authenticated");

      const { data, error } = await getFilms({
        userID,
        range: calculateRange(pageParam, limit),
        collectionID,
      });

      if (error) throw error;
      return data;
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.length) return undefined;
      return allPages.length;
    },

    enabled: Boolean(userID),
  });

  const films = query.data?.pages
    ? query.data.pages.flatMap((cur) => {
        if (!cur) return [];
        return cur;
      })
    : null;

  return {
    ...query,
    data: films,
  };
}

export default useGetFilms;
