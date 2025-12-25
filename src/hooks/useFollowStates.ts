"use client";

import { useQuery } from "@tanstack/react-query";
import { getFollowingCount } from "@utils/api/user/get-following-count";

function useFollowStates(userID: string | null, targetUserID: string) {
  // const [result, setResult] = useState<UserFollowings | null>(null);

  // const fetchFollowStates = useCallback(async () => {
  //   const { data, error } = await getFollowingCount(userID, targetUserID);

  //   if (error) throw new Error(error);

  //   if (!data) return null;

  //   return data;
  // }, [userID, targetUserID]);

  // Only fetch if targetUserID is present
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["follow", "states", targetUserID],
    queryFn: () => getFollowingCount(userID, targetUserID),
    enabled: Boolean(targetUserID),
  });

  // useEffect(() => {
  //   fetchFollowStates();
  // }, [fetchFollowStates]);

  return { isLoading, result: data?.data, error, refetch };
}

export default useFollowStates;
