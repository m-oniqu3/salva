import FilmDetails from "@/components/films/FilmDetails";
import { MediaType } from "@/types/tmdb";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getFilmById } from "@utils/api/films/get-film-by-id";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ media_type: string; id: number }>;
};

const MediaTypes = ["movie", "tv"] as const;

async function page({ params }: Props) {
  const { media_type, id } = await params;
  const queryClient = new QueryClient();

  if (!media_type || !id) {
    console.log("no media type or id present");
    // todo : show toast

    redirect("/");
  }

  // Check if media type is valid
  if (!MediaTypes.includes(media_type as MediaType)) {
    console.log(`Invalid media type: ${media_type}`);
    redirect("/");
  }

  // Check if film id is valid
  if (isNaN(Number(id))) {
    return <div>Invalid film ID</div>;
  }

  const { data, error } = await getFilmById(media_type as MediaType, id);

  if (error) {
    return <div>could not find film</div>;
  }

  if (!data) {
    return <p>no film found</p>;
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const { data: profile } = await getProfile({
    username: null,
    id: auth.user?.id,
  });

  if (auth.user?.id) {
    queryClient.prefetchQuery({
      queryKey: ["collection", "meta", auth.user?.id ?? ""],
      queryFn: () => getCollectionsMeta(),
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilmDetails
        film={data.film}
        credits={data.credits}
        media_type={media_type as MediaType}
        user={
          profile ? { id: profile.user_id, username: profile.username } : null
        }
      />
    </HydrationBoundary>
  );
}

export default page;
