"use client";

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
    <div className="pages">
      <nav className="flex items-center justify-between">
        <ul className="flex items-center justify-center gap-2 w-full">
          {rendered_links}
        </ul>
      </nav>

      {children}
    </div>
  );
}

export default SearchLayout;
