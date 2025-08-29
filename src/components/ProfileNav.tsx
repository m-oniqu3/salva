"use client";

import { AddIcon } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  username: string;
};

const links = [
  { name: "Films", href: "films" },
  { name: "Boards", href: "boards" },
];

function ProfileNav(props: Props) {
  const path = usePathname();

  const { username } = props;
  console.log(path, username);

  const renderedLinks = links.map((link) => {
    return (
      <li
        key={link.name}
        className="font-medium cursor-pointer tracking-wider border-t-[1.5px] border-black relative -top-[1.5px]"
      >
        <Link href={`/${username}/${link.href}`}>{link.name}</Link>
      </li>
    );
  });

  return (
    <header className="h-14 flex items-center">
      <nav className="wrapper flex items-center justify-between ">
        <ul className="flex gap-2">{renderedLinks}</ul>

        <div>
          <AddIcon />
        </div>
      </nav>
    </header>
  );
}

export default ProfileNav;
