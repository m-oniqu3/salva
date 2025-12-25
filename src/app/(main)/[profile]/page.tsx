import CollectionList from "@/components/collection/CollectionList";
import ProfileSummary from "@/components/profile/ProfileSummary";
import getUser from "@/server-actions/get-user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProfile } from "@utils/api/profile/get-profile";
import { getFollowers } from "@utils/api/user/get-followers";
import { getFollowing } from "@utils/api/user/get-following";
import { getFollowingCount } from "@utils/api/user/get-following-count";
import { createClient } from "@utils/supabase/server";

import { redirect } from "next/navigation";
type Props = {
  params: Promise<{ profile: string }>;
};

async function page({ params }: Props) {
  const { profile: username } = await params;

  if (!username) redirect("/");

  const supabase = await createClient();
  const queryClient = new QueryClient();

  const [profileDetails, userDetails] = await Promise.all([
    getProfile({ username }),
    getUser(supabase),
  ]);

  const { data: user } = userDetails;
  const { data: profile } = profileDetails;

  const userID = user?.id ?? null;

  if (!profile) {
    return <div>Profile does not exist </div>;
  }

  const targetUserID = profile.user_id;

  await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["follow", "followers", targetUserID],
      queryFn: ({ pageParam }) =>
        getFollowers({ targetUserID, page: pageParam }),
      initialPageParam: 0,
    }),

    queryClient.prefetchInfiniteQuery({
      queryKey: ["follow", "followings", targetUserID],
      queryFn: ({ pageParam }) =>
        getFollowing({ targetUserID, page: pageParam }),

      initialPageParam: 0,
    }),

    queryClient.prefetchQuery({
      queryKey: ["follow", "states", targetUserID],
      queryFn: () => getFollowingCount(userID, targetUserID),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col py-12 gap-24 ">
        <ProfileSummary profile={profile} userID={userID} />
        <CollectionList username={username} />
      </div>
    </HydrationBoundary>
  );
}

export default page;
