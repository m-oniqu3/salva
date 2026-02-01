import ErrorState from "@/components/ErrorState";
import AllFilms from "@/components/films/AllFilms";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getFilms } from "@utils/api/films/get-films";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import { calculateRange } from "@utils/validation/paginate";

async function page() {
  const queryClient = new QueryClient();
  const supabase = await createClient();

  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return (
      <ErrorState
        title="Director’s Cut Only"
        message="Sign in to curate your collections like a true cinephile."
        buttonLabel="Sign In"
        link="/login"
      />
    );
  }

  const { data: profile, error } = await getProfile({ id: auth.user.id });

  if (error || !profile) {
    return (
      <ErrorState
        title="The reel broke! 🍿"
        message="We couldn’t load your profile due to a server hiccup. Give it another shot!"
      />
    );
  }

  const user = { id: profile.user_id, username: profile.username };

  // prefetch the films
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["all-films", user.id],
    queryFn: ({ pageParam }) =>
      getFilms({
        userID: user?.id,
        range: calculateRange(pageParam, 20),
      }),

    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="pb-20">
        <h1 className="font-semibold text-md py-10">All Films</h1>
        <AllFilms user={user} />
      </div>
    </HydrationBoundary>
  );
}

export default page;
