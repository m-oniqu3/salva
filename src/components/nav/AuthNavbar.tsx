"use client";

import Button from "@/components/Button";
import {
  ArrowDownIcon,
  BookmarkIcon,
  FilmIcon,
  MenuIcon,
} from "@/components/icons";
import Searchbar from "@/components/Searchbar";
import { ContextMenuActionEnum } from "@/context/actions/ContextMenuActions";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ContextMenuEnum } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import { Profile } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

type Props = {
  profile: Profile | null;
};

function AuthNavbar({ profile }: Props) {
  const { dispatch } = useModal();
  const { dispatch: ctxDispatch } = useContextMenu();

  function handleMobileMenu() {
    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: ModalEnum.MOBILE_MENU,
    });
  }

  function handleCreateCollection() {
    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: ModalEnum.CREATE_COLLECTION_MODAL,
    });
  }

  function handleContextMenu(e: MouseEvent) {
    e.stopPropagation();

    ctxDispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: {
        currentContextMenu: ContextMenuEnum.PROFILE_MENU,
        position: { x: 0, y: 30 },
      },
    });
  }

  return (
    <header className="flex items-center h-20">
      <nav className="wrapper flex items-center justify-between gap-6 md:gap-6 ">
        <div className="flex gap-4 items-center">
          <Link href="/">
            <FilmIcon className="size-7" />
          </Link>

          <Link href={"#"} className="text-sml font-semibold hidden md:grid">
            Discover
          </Link>

          <Link href={"#"} className="text-sml font-semibold hidden md:grid">
            Shop
          </Link>
        </div>

        <Searchbar />

        <button type="button" onClick={handleMobileMenu} className="md:hidden">
          <MenuIcon className="size-5" />
        </button>

        {!profile && (
          <div className="hidden md:flex items-center gap-4">
            <Button>Log In</Button>
            <Button className="bg-black text-white">Sign Up</Button>
          </div>
        )}

        {profile && (
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={handleCreateCollection}
              className="bg-black text-white"
            >
              Create
            </Button>

            <BookmarkIcon className="size-5" />

            <Link
              href={`/${profile.username}`}
              className="border-black border-2 rounded-full flex items-center justify-center size-8"
            >
              <figure className="">
                {profile.avatar && (
                  <Image
                    src={profile.avatar}
                    alt={`${profile.username}'s avatar'`}
                    width="90"
                    height="90"
                    className="rounded-full object-cover size-6 gray"
                  />
                )}

                {!profile.avatar && (
                  <Image
                    src={`https://avatar.iran.liara.run/username?username=${profile.username}`}
                    alt={`${profile.username}'s avatar'`}
                    width="90"
                    height="90"
                    className="rounded-full object-cover size-6 gray"
                  />
                )}
              </figure>
            </Link>

            <button
              type="button"
              className="cursor-pointer"
              onClick={handleContextMenu}
            >
              <ArrowDownIcon className="size-5" />
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default AuthNavbar;
