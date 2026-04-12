"use client";

import { GENRES } from "@utils/tmdb-genres";
import { slugify } from "@utils/validation/slug";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function FilmGenres() {
  const pathname = usePathname();
  const genre = pathname.split("/").pop();

  const [selectedGenre, setSelectedGenre] = useState(genre);

  return (
    <ul className="flex flex-wrap gap-8">
      {GENRES.map((genre) => {
        const slug = slugify(genre);
        return (
          <li
            key={genre}
            className={`text-xs font-semibold  p-3 h-9 rounded-full cursor-pointer flex items-center justify-center ${selectedGenre === slug ? "bg-neutral-800 text-white opacity-100" : "opacity-50"}`}
            onClick={() => setSelectedGenre(slug)}
          >
            <Link href={"/discover/" + slug}>{genre}</Link>
          </li>
        );
      })}
    </ul>
  );
}

export default FilmGenres;
