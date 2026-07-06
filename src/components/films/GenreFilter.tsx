"use client";

import { TMDB_GENRE_MAP } from "@utils/tmdb-genres";
import Link from "next/link";
import { usePathname } from "next/navigation";

function GenreFilter() {
  const pathname = usePathname();
  const selectedGenreKey = pathname.split("/")[2] ?? "";

  return (
    <ul className="flex flex-wrap gap-4">
      {Object.entries(TMDB_GENRE_MAP).map(([key, genre]) => (
        <li key={key}>
          <Link
            href={`/discover/${key}`}
            className={`text-xs font-semibold p-3 h-9 rounded-full flex items-center justify-center ${selectedGenreKey === key ? "bg-neutral-800 text-white opacity-100" : "opacity-50 gray"}`}
          >
            {genre}
          </Link>
        </li>
      ))}

      {selectedGenreKey && (
        <Link
          href="/discover"
          className={`text-xs font-semibold p-3 h-9 rounded-full flex items-center justify-center bg-neutral-800 text-white`}
        >
          Clear
        </Link>
      )}
    </ul>
  );
}

export default GenreFilter;
