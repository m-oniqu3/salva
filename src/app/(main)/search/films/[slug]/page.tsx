import Film from "@/components/films/Film";
import { getFilms } from "@utils/api/search/get-films";
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

  const films = await getFilms(slug);

  if (!films) {
    console.log("no films");
    return;
  }

  console.log(films);

  const rendered_films = films.map((film) => {
    return <Film key={film.id} film={film} />;
  });

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:grid-cols-5 lg:gap-10">
      {rendered_films}
    </div>
  );
}

export default page;
