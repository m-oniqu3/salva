import DiscoverResults from "@/components/discover/DiscoverResults";
import { UserMeta } from "@/types/user";
import { discoverFilms } from "@utils/api/films/discover-films-default";
import { getProfile } from "@utils/api/profile/get-profile";
import { createClient } from "@utils/supabase/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ genre: string }>;
};

async function DiscoverGenrePage({ params }: Props) {
  const { genre } = await params;
  const genreKey = Number(genre);

  const supabase = await createClient();
  const auth = await supabase.auth.getUser();

  const [defaultFilms, profile] = await Promise.all([
    discoverFilms({
      genreKey: Number.isNaN(genreKey) ? undefined : genreKey,
    }),
    auth.data.user && getProfile({ key: "user_id", value: auth.data.user.id }),
  ]);

  const user: UserMeta = profile?.data
    ? { userID: profile.data.user_id, username: profile.data.username }
    : null;

  return (
    <Suspense fallback={null}>
      <DiscoverResults
        key={genre}
        defaultFilms={defaultFilms.films}
        genreKey={genre}
        user={user}
      />
    </Suspense>
  );
}

export default DiscoverGenrePage;
