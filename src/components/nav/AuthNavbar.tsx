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
import { ContextMenuActionEnum } from "@/context/actions/ContextMenuActions";
import { ModalActionEnum } from "@/context/actions/ModalActions";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ContextMenuEnum } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import { Profile } from "@/types/user";
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
      <nav className="w-full flex items-center justify-between gap-6 md:gap-6">
        <ul className="flex gap-6 items-center">
          <Link href="/" className="font-extrabold capitalize text-xl relative">
            <FilmIcon className="size-6 text-black" />
          </Link>

          <Link
            href={"#"}
            className="text-zinc-600 text-sml font-semibold hidden md:grid"
          >
            Discover
          </Link>

          <Link
            href={"#"}
            className="text-zinc-600 text-sml font-semibold hidden md:grid"
          >
            Shop
          </Link>
        </ul>

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

            <BookmarkIcon className="size-4" />

            {/* <div className="border-black border-[1.8px] rounded-full flex items-center justify-center size-7"> */}
            <Avatar
              avatar={profile.avatar}
              username={profile.username}
              className={"size-7 rounded-full text-[12px]"}
            />

            <button
              type="button"
              className="cursor-pointer"
              onClick={handleContextMenu}
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
