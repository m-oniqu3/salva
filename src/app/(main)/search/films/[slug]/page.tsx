import Film from "@/components/films/Film";
import getUser from "@/server-actions/get-user";
import { getLastSavedCollectionMeta } from "@utils/api/collections/get-last-saved-collection-meta";
import { getFilms } from "@utils/api/films/get-films";
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

  const [films, user] = await Promise.all([
    getFilms(slug),
    createClient().then((data) => getUser(data)),
  ]);

  if (!films) {
    console.log("no films");
    return <p>no films</p>;
  }

  const collectionMeta = user.data?.id
    ? (await getLastSavedCollectionMeta(user.data.id)).data
    : null;

  const rendered_films = films.map((film) => {
    return (
      <Film
        key={film.id}
        film={film}
        userID={user.data?.id ?? null}
        collectionMeta={collectionMeta}
      />
    );
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xs:gap-12">
      {rendered_films}
    </div>
  );
}

export default page;
