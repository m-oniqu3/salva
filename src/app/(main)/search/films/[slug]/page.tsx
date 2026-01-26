import Film from "@/components/films/Film";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getFilms } from "@utils/api/films/get-films";
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
    getFilms(slug),
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

  const rendered_films = films.map((film) => {
    return (
      <Film
        key={film.id}
        film={film}
        user={
          profile.data
            ? { id: profile.data.user_id, username: profile.data.username }
            : null
        }
      />
    );
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 sm:gap-16 lg:grid-cols-3 xl:grid-cols-4 ">
        {rendered_films}
      </div>
    </HydrationBoundary>
  );
}

export default page;
