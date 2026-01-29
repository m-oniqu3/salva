import Film from "@/components/films/Film";
import { TMDBFilm } from "@/types/tmdb";

type Props = {
  films: TMDBFilm[];
  user: { id: string; username: string } | null;
};

function SimilarFilms(props: Props) {
  const { films, user } = props;

  const rendered_films = films.map((film) => {
    return <Film key={film.id} film={film} user={user} />;
  });

  return (
    <div
      id="similar-films"
      className="wrapper grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 sm:gap-16 lg:grid-cols-3 xl:grid-cols-4 "
    >
      {rendered_films}
    </div>
  );
}

export default SimilarFilms;
