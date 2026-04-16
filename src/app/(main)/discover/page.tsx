import DiscoverFilms from "@/components/discover/DiscoverFilms";
import TopCollections from "@/components/discover/TopCollections";
import { UserMeta } from "@/types/user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { defaultDiscoverFilms } from "@utils/api/films/discover-films-default";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

async function DiscoverPage() {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["discover", "default"],
  //   queryFn: defaultDiscoverFilms,
  // });
  const queryClient = new QueryClient();

  const supabase = await createClient();
  const auth = await supabase.auth.getUser();

  const [films, profile] = await Promise.all([
    defaultDiscoverFilms({}),
    auth.data.user && getProfile({ key: "user_id", value: auth.data.user?.id }),

    await queryClient.prefetchQuery({
      queryKey: ["collection", "meta"],
      queryFn: async () => {
        const { data, error } = await getCollectionsMeta();
        if (error) throw error;
        return data;
      },
    }),
  ]);

  const user: UserMeta = profile?.data
    ? { userID: profile.data.user_id, username: profile.data.username }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="pages">
        <TopCollections />
        <DiscoverFilms defaultFilms={films} user={user} />
      </div>
    </HydrationBoundary>
  );
}

export default DiscoverPage;
