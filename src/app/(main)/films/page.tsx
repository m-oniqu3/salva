import ErrorState from "@/components/ErrorState";
import Films from "@/components/films/Films";
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
        heading="Director’s Cut Only"
        message="Log in to curate your collections like a true cinephile."
        buttonLabel="Log In"
        link="/login"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-center text-center w-3xs"
      />
    );
  }

  const { data: profile, error } = await getProfile({ id: auth.user.id });

  if (error || !profile) {
    return (
      <ErrorState
        heading="The reel broke! 🍿"
        message="We couldn’t load your profile due to a server hiccup. Give it another shot!"
      />
    );
  }

  const user = { userID: profile.user_id, username: profile.username };

  // prefetch the films
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["films", user.userID],
    queryFn: ({ pageParam }) =>
      getFilms({
        userID: user?.userID,
        range: calculateRange(pageParam, 20),
      }),

    initialPageParam: 0,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="pb-20">
        <div className="py-10">
          <h1 className="font-semibold text-md sm:text-lg">All Films</h1>
          <p className="text-sml">
            {"Here are all the films you've saved so far."}
          </p>
        </div>
        <Films user={user} targetUser={{ userID: user.userID }} />
      </div>
    </HydrationBoundary>
  );
}

export default page;
