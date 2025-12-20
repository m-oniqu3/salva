"use client";

import { useQuery } from "@tanstack/react-query";
import { findFollowing } from "@utils/api/user/get-following-count";
import { useCallback, useEffect } from "react";

function useFollowStates(userID: string | null, targetUserID: string) {
  // const [result, setResult] = useState<UserFollowings | null>(null);

  const fetchFollowStates = useCallback(async () => {
    const { data, error } = await findFollowing(userID, targetUserID);

    if (error) throw new Error(error);

    if (!data) return null;

    return data;
  }, [userID, targetUserID]);

  // Only fetch if targetUserID is present
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["follow-states", targetUserID],
    queryFn: fetchFollowStates,
    enabled: Boolean(targetUserID),
  });

  useEffect(() => {
    fetchFollowStates();
  }, [fetchFollowStates]);

  return { isLoading, data, error, refetch };
}

export default useFollowStates;
