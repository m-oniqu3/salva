"use client";

import { CloseIcon } from "@/components/icons";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types/modal";
import Link from "next/link";

function MobileMenu() {
  const {
    closeModal,
    stopPropagation,
    state: { modal },
  } = useModal();

  if (modal?.type !== ModalEnum.MOBILE_MENU) return null;

  const profile = modal?.payload?.profile;

  const links = [
    { name: "home", href: "/" },
    { name: "discover", href: "/discover" },
    { name: "logout", href: "logout" },
  ];

  if (profile) {
    links.splice(1, 0, {
      name: "profile",
      href: "/" + profile.username,
    });
  }

  return (
    <div
      className="h-full w-full bg-white fixed top-0 left-0 "
      onClick={stopPropagation}
    >
      <ul className="grid grid-rows-4 auto-rows-[minmax(80px,1fr)] ">
        {links.map((link) => {
          return (
            <li key={link.name}>
              <Link
                onClick={closeModal}
                href={link.href}
                className="block capitalize h-full p-8 w-full bg-white border-b border-neutral-100 ease-in-out duration-300 hover:bg-neutral-100"
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      <footer className="fixed bottom-5 right-5 z-50 flex items-center justify-end h-20 p-8">
        <button onClick={closeModal} className=" cursor-pointer">
          <CloseIcon className="size-5" />
        </button>
      </footer>
    </div>
  );
}

export default MobileMenu;
