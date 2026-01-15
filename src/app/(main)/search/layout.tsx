"use client";

import Button from "@/components/Button";
import { ChevronDownIcon } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

function SearchLayout({ children }: Props) {
  const links = ["films", "collections", "profiles"];

  const pathname = usePathname();

  const [, page, slug] = pathname.split("/").slice(1) as unknown as string[];

  const [activeLink, setActiveLink] = useState<string>(page || links[0]);

  const rendered_links = links.map((link) => {
    return (
      <Link
        key={link}
        href={`/search/${link}/${slug}`}
        onClick={() => setActiveLink(link)}
        className={`p-3 h-9 rounded-full text-sml font-semibold cursor-pointer flex items-center justify-center capitalize opacity-50 ${
          activeLink === link ? "gray opacity-100" : ""
        }`}
      >
        {link}
      </Link>
    );
  });

  return (
    <div className="flex flex-col gap-12 pb-12">
      <header>
        <nav className="h-20 flex items-center justify-between">
          <Button className="gray hidden md:flex">
            All
            <span>
              <ChevronDownIcon className="size-4" />
            </span>
          </Button>

          <ul className="flex items-center justify-center gap-2 w-full">
            {rendered_links}
          </ul>

          <Button className="gray hidden md:flex">
            Relevant
            <span>
              <ChevronDownIcon className="size-4" />
            </span>
          </Button>
        </nav>
      </header>

      {children}
    </div>
  );
}

export default SearchLayout;
