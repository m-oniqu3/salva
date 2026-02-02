"use client";

import { FilmIcon, SearchIcon } from "@/components/icons";
import { slugify } from "@utils/validation/slug";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

const pages = new Set(["films", "collections", "profiles"]);

function Searchbar() {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const pathname = usePathname();
  const [, page] = pathname.split("/").slice(1) as unknown as string[];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!searchRef.current) return;
    const slug = slugify(searchRef.current.value);

    if (page) {
      if (!pages.has(page)) {
        router.replace("/search/films/" + slug);
        return;
      }

      router.replace(`/search/${page}/${slug}`);
      return;
    }

    router.replace("/search/films/" + slug);
  }

  return (
    <form
      className="relative grid grid-cols-[auto_50px] sm:grid-cols-[60px_auto_60px] w-full"
      onSubmit={handleSubmit}
    >
      <div className="hidden sm:flex w-full flex-center rounded-l-2xl gray">
        <FilmIcon className="size-5 text-neutral-400 animate-pulse" />
      </div>

      <input
        ref={searchRef}
        type="text"
        className="gray w-full text-sml h-12.5 px-4 rounded-l-2xl sm:px-0 sm:rounded-none font-medium focus:outline-none placeholder:text-neutral-500"
        placeholder="Search..."
      />

      <button
        type="submit"
        onClick={handleSubmit}
        className="cursor-pointer w-full flex-center rounded-r-2xl gray"
      >
        <SearchIcon className="size-4 text-neutral-400" />
      </button>
    </form>
  );
}

export default Searchbar;
