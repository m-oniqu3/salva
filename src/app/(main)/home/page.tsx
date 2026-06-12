import AllFilms from "@/components/films/AllFilms";
import { UserMeta } from "@/types/user";
import { QueryClient } from "@tanstack/react-query";
import { getCollectionsMeta } from "@utils/api/collections/get-collections-meta";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";

async function HomePage() {
  const queryClient = new QueryClient();

  const supabase = await createClient();
  const auth = await supabase.auth.getUser();

  const [profile] = await Promise.all([
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
    <div className="">
      <AllFilms user={user} />
    </div>
  );
}

export default HomePage;
