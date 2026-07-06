import FilmDetailsShell from "@/components/films/FilmDetailsShell";
import { MediaType } from "@/types/tmdb";
import { type UserMeta } from "@/types/user";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getFilmById } from "@utils/api/films/get-film-by-id";
import { getSimilarFilms } from "@utils/api/films/get-similar-films";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ media_type: MediaType; id: number }>;
};

const MediaTypes = ["movie", "tv"] as const;

function isValidParams(media_type: MediaType, id: number) {
  if (!media_type || !id) {
    // todo : show toast
    redirect("/");
  }

  // const isValid = MediaTypes.includes(media_type) || isNaN(Number(id));
  const isValid = MediaTypes.includes(media_type) && !isNaN(Number(id));

  if (isValid) return;

  if (!isValid) {
    // todo : show toast
    console.log("Invalid Param");
    redirect("/");
  }
}

async function page({ params }: Props) {
  const { media_type, id } = await params;
  const queryClient = new QueryClient();

  isValidParams(media_type, id);

  const { data, error } = await getFilmById(media_type, id);

  if (error) return <div>could not find film</div>;
  if (!data) return <p>no film found</p>;

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  let profile = null;

  const prefetches = [
    queryClient.prefetchInfiniteQuery({
      queryKey: ["similar", media_type, id],
      queryFn: ({ pageParam }) =>
        getSimilarFilms(media_type, id, pageParam as number),
      initialPageParam: 1,
    }),
  ];

  if (auth.user) {
    const profilePromise = getProfile({ key: "user_id", value: auth.user.id });

    prefetches.push(
      queryClient.prefetchQuery({
        queryKey: ["collection", "meta"],
        queryFn: async () => {
          const { data, error } = await getCollectionsMeta();
          if (error) throw error;
          return data;
        },
      }),
    );

    const [{ data: profileData }] = await Promise.all([
      profilePromise,
      Promise.all(prefetches),
    ]);

    profile = profileData;
  } else {
    await Promise.all(prefetches);
  }

  const user: UserMeta = profile
    ? { userID: profile.user_id, username: profile.username }
    : null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilmDetailsShell
        data={data}
        user={user}
        media_type={media_type}
        filmID={id}
      />
    </HydrationBoundary>
  );
}
export default page;
