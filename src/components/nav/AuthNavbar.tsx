"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import {
  ArrowDownIcon,
  BookmarkIcon,
  FilmIcon,
  MenuIcon,
} from "@/components/icons";
import Searchbar from "@/components/Searchbar";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import useClientRect from "@/hooks/useClientRect";
import { ContextMenuEnum } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import { Profile } from "@/types/user";
import Link from "next/link";

type Props = {
  profile: Profile | null;
};

const links = ["discover", "discuss"];

function AuthNavbar({ profile }: Props) {
  const { openModal } = useModal();
  const { openContextMenu } = useContextMenu();
  const { ref: profileUserMenuRef, rect } = useClientRect<HTMLButtonElement>();

  function handleProfileContextMenu() {
    if (!rect) return;
    console.log(rect);

    openContextMenu({
      type: ContextMenuEnum.PM,
      position: { top: rect.top + 50, right: 0 },
    });
  }

  const rendered_links = links.map((link) => {
    return (
      <Link
        key={link}
        href={"/" + link}
        className="text-zinc-600 text-sml font-semibold capitalize hidden md:grid"
      >
        {link}
      </Link>
    );
  });

  return (
    <header className="flex items-center sticky top-0 left-0 h-28 z-10 bg-white w-full">
      <nav className="w-full grid grid-cols-[50px_auto_50px] lg:grid-cols-3 items-center justify-between gap-2 md:gap-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-extrabold capitalize text-xl relative">
            <FilmIcon className="size-6 text-neutral-800" />
          </Link>

          <ul className="hidden lg:flex gap-4 items-center">
            {rendered_links}
          </ul>
        </div>

        <div className="">
          <Searchbar />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => openModal({ type: ModalEnum.MM })}
            className="flex-center lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>

          {!profile && (
            <div className="hidden lg:flex items-center gap-4">
              <Button>Log In</Button>
              <Button className="bg-neutral-800 text-white">Sign Up</Button>
            </div>
          )}

          {profile && (
            <div className="hidden lg:flex items-center gap-4">
              <Button
                onClick={() => openModal({ type: ModalEnum.CCM })}
                className="bg-neutral-800 text-white"
              >
                Create
              </Button>

              <Link href={"/films"}>
                <BookmarkIcon className="size-4" />
              </Link>

              {/* <div className="border-black border-[1.8px] rounded-full flex items-center justify-center size-7"> */}
              <Avatar
                avatar={profile.avatar}
                username={profile.username}
                className={"size-7 rounded-full text-[12px]"}
              />

              <button
                ref={profileUserMenuRef}
                type="button"
                className="cursor-pointer"
                onClick={handleProfileContextMenu}
                name="Profile User Menu"
              >
                <ArrowDownIcon className="size-4" />
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AuthNavbar;
