"use client";

import { usePathname } from "next/navigation";

function GenreFilms() {
  const pathname = usePathname();
  const genre = pathname.split("/").pop();

  return <div>{genre}</div>;
}

export default GenreFilms;
