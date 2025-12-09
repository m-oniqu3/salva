"use client";

import { UserFollowings } from "@/types/user";
import { getIsFollowing } from "@utils/api/user/find-following";
import { useCallback, useEffect, useState } from "react";

function useFollow(userID: string | null, targetUserID: string) {
  const [data, setData] = useState<UserFollowings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFollowStates = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getIsFollowing(userID, targetUserID);

      if (error) throw new Error(error);

      setData(data);
    } catch (error: unknown) {
      setError(error as unknown as string);
    } finally {
      setIsLoading(false);
    }
  }, [userID, targetUserID]);

  useEffect(() => {
    fetchFollowStates();
  }, [fetchFollowStates]);

  return { isLoading, data, error, refresh: fetchFollowStates };
}

export default useFollow;
