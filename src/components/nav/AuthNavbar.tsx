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
    <header className="flex items-center h-28 sticky top-0 left-0 bg-white z-10">
      <nav className="w-full flex items-center justify-between gap-6 md:gap-6">
        <ul className="flex gap-6 items-center">
          <Link href="/" className="font-extrabold capitalize text-xl relative">
            <FilmIcon className="size-6 text-neutral-800" />
          </Link>

          {rendered_links}
        </ul>

        <Searchbar />

        <button
          type="button"
          onClick={() => openModal({ type: ModalEnum.MM })}
          className="md:hidden"
        >
          <MenuIcon className="size-5" />
        </button>

        {!profile && (
          <div className="hidden md:flex items-center gap-4">
            <Button>Log In</Button>
            <Button className="bg-neutral-800 text-white">Sign Up</Button>
          </div>
        )}

        {profile && (
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={() => openModal({ type: ModalEnum.CCM })}
              className="bg-neutral-800 text-white"
            >
              Create
            </Button>

            <BookmarkIcon className="size-4" />

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
      </nav>
    </header>
  );
}

export default AuthNavbar;
