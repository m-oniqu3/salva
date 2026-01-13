"use client";

import { FilmIcon, SearchIcon } from "@/components/icons";
import { slugify } from "@utils/validation/slug";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

function Searchbar() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const pathname = usePathname();
  const [, page] = pathname.split("/").slice(1) as unknown as string[];
  console.log("search", page);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!searchRef.current) return;
    const slug = slugify(searchRef.current.value);

    if (page) {
      router.replace(`/search/${page}/${slug}`);
      return;
    }

    router.replace("/search/films/" + slug);
  }

  return (
    <form
      className="relative w-full max-w-72 md:max-w-80 lg:max-w-sm mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="absolute top-4 left-5 z-10 ">
        <FilmIcon className="size-5 text-neutral-400 animate-pulse" />
      </div>

      <input
        ref={searchRef}
        type="text"
        className="gray w-full text-sml rounded-2xl h-[50px] pl-12 mr-20 font-medium focus:outline-none placeholder:text-neutral-500"
        placeholder="Search..."
      />

      <div className="absolute top-4.5 right-5 z-10 cursor-pointer">
        <SearchIcon className="size-4 text-neutral-400" />
      </div>
    </form>
  );
}

export default Searchbar;
