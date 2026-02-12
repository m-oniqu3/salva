import Collections from "@/components/collection/Collections";
import ErrorState from "@/components/ErrorState";
import ProfileSummary from "@/components/profile/ProfileSummary";
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

import { Suspense } from "react";
type Props = {
  params: Promise<{ profile: string }>;
};

async function page({ params }: Props) {
  const { profile: username } = await params;

  //maybe reduntant
  // if (!username) redirect("/");

  const supabase = await createClient();
  const queryClient = new QueryClient();

  const [profileDetails, userDetails] = await Promise.all([
    getProfile({ username }),
    supabase.auth.getUser(),
  ]);

  const { user } = userDetails.data;
  const { data: profile } = profileDetails;

  const userID = user?.id ?? null;

  if (!profile) {
    return (
      <div className="h-[50dvh] w-full">
        <ErrorState
          heading="Scene not found."
          message="The profile you’re looking for didn’t make the final cut."
        />
      </div>
    );
  }

  const isCollectionOwner = profile.user_id === user?.id;
  const targetUserID = profile.user_id;

  Promise.all([
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
      <div className="flex flex-col gap-24 ">
        <ProfileSummary profile={profile} userID={userID} />

        <Suspense fallback={<p>Loading collections...</p>}>
          <Collections
            username={username}
            isCollectionOwner={isCollectionOwner}
          />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export default page;
