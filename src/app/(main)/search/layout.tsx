"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

function SearchLayout({ children }: Props) {
  const links = ["films", "collections", "profiles"];
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "";

  console.log();

  const rendered_links = links.map((link) => {
    return (
      <Link
        key={link}
        href={`/search/${link}/${slug}`}
        className="p-3 h-9 rounded-full text-xs font-bold cursor-pointer flex items-center justify-center capitalize gray"
      >
        {link}
      </Link>
    );
  });

  return (
    <div className="flex flex-col gap-12">
      <header>
        <nav
          className="h-20 flex items-
      center justify-center"
        >
          <Button className="gray ml-auto">All</Button>
          <ul className="flex items-center justify-center gap-2 w-full">
            {rendered_links}
          </ul>

          <Button className="gray ml-auto">Relevant </Button>
        </nav>
      </header>

      {children}
    </div>
  );
}

export default SearchLayout;
