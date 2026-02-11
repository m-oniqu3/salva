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
    queryKey: ["all-films", collectionID ?? "", userID],
    queryFn: ({ pageParam }) => {
      return getFilms({
        userID,
        range: calculateRange(pageParam, limit),
        collectionID,
      });
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage?.data?.length) return undefined;
      return allPages.length;
    },

    enabled: Boolean(userID),
  });

  const films = query.data?.pages
    ? query.data.pages.flatMap((cur) => {
        if (!cur?.data) return [];
        return cur.data;
      })
    : null;

  return {
    ...query,
    data: films,
    error: query.data?.pages?.[0]?.error,
  };
}

export default useGetFilms;
