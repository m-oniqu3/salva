"use client";

import { CloseIcon, FilmIcon, SearchIcon } from "@/components/icons";
import { slugify } from "@utils/validation/slug";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

const pages = new Set(["films", "collections", "profiles"]);

function Searchbar() {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const pathname = usePathname();
  const [, page] = pathname.split("/").slice(1) as unknown as string[];

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!search) return;
    const slug = slugify(search);

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

  function clearSearch() {
    setSearch("");

    if (searchRef.current) {
      searchRef.current.focus();
    }
  }

  return (
    <form
      className="relative grid grid-cols-[50px_auto_50px] sm:grid-cols-[60px_auto_60px] w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex w-full flex-center rounded-l-2xl gray">
        <FilmIcon className="size-5 text-neutral-400 animate-pulse" />
      </div>

      <input
        type="text"
        ref={searchRef}
        value={search}
        onChange={handleSearch}
        className="gray w-full text-sml h-12.5 pr-4 font-medium focus:outline-none placeholder:text-neutral-500"
        placeholder="Search..."
      />

      {search ? (
        <button
          type="button"
          onClick={clearSearch}
          className="cursor-pointer w-full flex-center rounded-r-2xl gray"
        >
          <CloseIcon className="size-4 text-neutral-400" />
        </button>
      ) : (
        <button
          type="submit"
          onClick={handleSubmit}
          className="cursor-pointer w-full flex-center rounded-r-2xl gray"
        >
          <SearchIcon className="size-4 text-neutral-400" />
        </button>
      )}
    </form>
  );
}

export default Searchbar;
