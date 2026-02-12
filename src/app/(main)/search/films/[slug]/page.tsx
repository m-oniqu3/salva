import Film from "@/components/films/Film";
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
  const queryClient = new QueryClient();

  if (!slug) {
    console.log("No film present to search");
    redirect("/");
  }

  const supabase = await createClient();
  const auth = await supabase.auth.getUser();

  const [films, profile] = await Promise.all([
    searchFilms(slug),
    getProfile({ username: null, id: auth.data.user?.id }),

    queryClient.prefetchQuery({
      queryKey: ["collection", "meta", auth.data.user?.id ?? ""],
      queryFn: () => getCollectionsMeta(),
    }),
  ]);

  if (!films || films.length === 0) {
    console.log("no films");
    return <p>no films</p>;
  }

  const user: UserMeta = profile.data
    ? { userID: profile.data.user_id, username: profile.data.username }
    : null;

  const rendered_films = films.map((film) => {
    return <Film key={film.id} film={film} user={user} />;
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="content-grid">{rendered_films}</div>
    </HydrationBoundary>
  );
}

export default page;
