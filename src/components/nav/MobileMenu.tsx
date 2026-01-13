"use client";
import { CloseIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import Link from "next/link";

const links = [
  { id: 0, name: "home", href: "home" },
  { id: 1, name: "discover", href: "discover" },
  { id: 2, name: "Create", href: "Create" },
  { id: 3, name: "profile", href: "profile" },
  { id: 4, name: "logout", href: "logout" },
];

function MobileMenu() {
  const { closeModal } = useModal();

  const renderedLinks = links.map((link) => {
    return (
      <li
        key={link.id}
        className="capitalize text-xl ease-in-out duration-300 hover:text-white"
      >
        <Link href={link.href}>{link.name}</Link>
      </li>
    );
  });

  return (
    <div className="absolute bg-white/30 backdrop-blur-md h-full w-full top-0 left-0">
      <header className="wrapper flex items-center justify-end h-20">
        <button onClick={closeModal} className=" cursor-pointer">
          <CloseIcon />
        </button>
      </header>

      <div className="wrapper">
        <ul className=" flex flex-col gap-3 absolute top-[20%]">
          {renderedLinks}
        </ul>
      </div>
    </div>
  );
}

export default MobileMenu;
