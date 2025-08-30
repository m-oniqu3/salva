"use client";

import { AddIcon } from "@/components/icons";
import Link from "next/link";
import { useState } from "react";

type Props = {
  username: string;
};

const links = [
  { id: 0, name: "Films", href: "films" },
  { id: 1, name: "Boards", href: "boards" },
];

function ProfileNav(props: Props) {
  const [activeLink, setActiveLink] = useState(1);
  const { username } = props;

  function handleActiveLink(id: number) {
    setActiveLink(id);
  }

  const renderedLinks = links.map((link) => {
    const isActive = activeLink === link.id;
    const stylesForActiveLink = isActive
      ? "border-black"
      : "border-transparent";

    return (
      <li
        key={link.id}
        onClick={handleActiveLink.bind(null, link.id)}
        className={`font-medium cursor-pointer relative -top-[1.5px] border-b-2  ${stylesForActiveLink}`}
      >
        <Link href={`/${username}/${link.href}`}>{link.name}</Link>
      </li>
    );
  });

  return (
    <header className="h-14 flex items-center">
      <nav className="wrapper flex items-center justify-between ">
        <ul className="flex gap-4">{renderedLinks}</ul>

        <AddIcon className="size-6" />
      </nav>
    </header>
  );
}

export default ProfileNav;
