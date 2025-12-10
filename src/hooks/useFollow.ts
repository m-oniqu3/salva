"use client";

import { useQuery } from "@tanstack/react-query";
import { getIsFollowing } from "@utils/api/user/find-following";
import { useCallback, useEffect } from "react";

function useFollow(userID: string | null, targetUserID: string) {
  // const [result, setResult] = useState<UserFollowings | null>(null);

  const fetchFollowStates = useCallback(async () => {
    const { data, error } = await getIsFollowing(userID, targetUserID);

    if (error) throw new Error(error);

    if (!data) return null;

    return data;
  }, [userID, targetUserID]);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["follow-states"],
    queryFn: fetchFollowStates,
  });

  useEffect(() => {
    fetchFollowStates();
  }, [fetchFollowStates]);

  return { isLoading, data, error, refetch };
}

export default useFollow;
