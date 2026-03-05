import Collections from "@/components/collection/Collections";
import ErrorState from "@/components/ErrorState";
import ProfileSummary from "@/components/profile/ProfileSummary";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getProfileSummary } from "@utils/api/profile/get-profile-summary";
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

  const [profileSummary, userDetails] = await Promise.all([
    getProfileSummary({ username }),
    supabase.auth.getUser(),
  ]);

  const { user } = userDetails.data;
  const { data: profile_summary } = profileSummary;

  const authUserID = user?.id ?? null;

  if (!profile_summary) {
    return (
      <ErrorState
        heading="Not in the credits."
        message="The profile you’re looking for didn’t make the final cut."
        className="error-state-wrapper"
      />
    );
  }

  // todo prefetch the collection previews

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="pages">
        <ProfileSummary
          profileSummary={profile_summary}
          authUserID={authUserID}
        />

        <Suspense fallback={<p>Loading collections...</p>}>
          <Collections targetUserID={profile_summary.user_id} />
        </Suspense>
      </div>
    </HydrationBoundary>
  );
}

export default page;
