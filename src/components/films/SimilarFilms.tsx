import Film from "@/components/films/Film";
import { TMDBFilm } from "@/types/tmdb";
import { UserMeta } from "@/types/user";

type Props = {
  films: TMDBFilm[];
  user: UserMeta;
};

function SimilarFilms(props: Props) {
  const { films, user } = props;

  const rendered_films = films.map((film, i) => {
    return <Film key={film.id + i} film={film} user={user} />;
  });

  return (
    <div id="similar-films" className="wrapper content-grid">
      {rendered_films}
    </div>
  );
}

export default SimilarFilms;
