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
import Image from "next/image";
import Link from "next/link";
import { MouseEvent } from "react";

function AuthNavbar() {
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
      payload: ModalEnum.CREATE_BOARD_MODAL,
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

        <div className="hidden md:flex items-center gap-4">
          <Button
            onClick={handleCreateCollection}
            className="bg-black text-white"
          >
            Create
          </Button>
          <BookmarkIcon className="size-5" />

          <Link
            href="/hagobi"
            className="border-black border-2 rounded-full flex items-center justify-center size-9"
          >
            <figure className="">
              <Image
                src="https://i.pinimg.com/736x/64/9b/b6/649bb6629df0875a3e65b2f31f1c40f3.jpg"
                alt="Clover from totally spies"
                width="100"
                height="100"
                className="rounded-full object-cover size-7"
              />
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
      </nav>
    </header>
  );
}

export default AuthNavbar;
