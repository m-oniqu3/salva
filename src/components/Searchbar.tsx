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
      className="relative grid grid-cols-[auto_50px] w-full"
      onSubmit={handleSubmit}
    >
      <div className="hidden w-full flex-center rounded-l-2xl gray">
        <FilmIcon className="size-5 text-neutral-400 animate-pulse" />
      </div>

      <input
        ref={searchRef}
        type="text"
        className="gray w-full px-4 text-sml h-[48px] rounded-l-2xl font-medium focus:outline-none placeholder:text-neutral-500"
        placeholder="Search..."
      />

      <div className=" w-full flex-center rounded-r-2xl gray">
        <SearchIcon className="size-4 text-neutral-400" />
      </div>
    </form>
  );
}

export default Searchbar;
