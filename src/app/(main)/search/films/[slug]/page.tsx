import SearchFilms from "@/components/search/SearchFilms";
import { UserMeta } from "@/types/user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { searchFilms } from "@utils/api/films/search-films";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

async function page({ params }: Props) {
  const { slug } = await params;

  if (!slug) {
    console.log("No film present to search");
    redirect("/");
  }

  const queryClient = new QueryClient();
  const supabase = await createClient();
  const auth = await supabase.auth.getUser();

  const [, profile] = await Promise.all([
    queryClient.prefetchInfiniteQuery({
      queryKey: ["search", slug],
      queryFn: ({ pageParam }) => searchFilms(slug, pageParam as number),
      initialPageParam: 1,
    }),

    auth.data.user && getProfile({ key: "user_id", value: auth.data.user?.id }),

    queryClient.prefetchQuery({
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
      <SearchFilms query={slug} user={user} />
    </HydrationBoundary>
  );
}

export default page;
