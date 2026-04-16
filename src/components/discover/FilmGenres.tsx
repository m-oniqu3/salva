"use client";

import { TMDB_GENRE_MAP } from "@utils/tmdb-genres";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

function FilmGenres() {
  const pathname = usePathname();
  const genreKey = pathname.split("/").pop();

  const [selectedGenreKey, setSelectedGenreKey] = useState(genreKey);
  const router = useRouter();

  function handleGenre(key: string) {
    router.push("/discover/" + key);
    setSelectedGenreKey(key);
  }

  return (
    <ul className="flex flex-wrap gap-8">
      {Object.entries(TMDB_GENRE_MAP).map(([key, genre]) => {
        return (
          <li
            key={key}
            className={`text-xs font-semibold  p-3 h-9 rounded-full cursor-pointer flex items-center justify-center ${selectedGenreKey === key ? "bg-neutral-800 text-white opacity-100" : "opacity-50 gray"}`}
            onClick={() => handleGenre(key)}
          >
            {genre}
          </li>
        );
      })}
    </ul>
  );
}

export default FilmGenres;
