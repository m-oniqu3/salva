"use client";

import { ContextMenuActionTypes } from "@/actions/ContextMenuActions";
import { ModalActionTypes } from "@/actions/ModalActions";
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
import { ContextMenuEnum, ModalEnum } from "@/types";
import Image from "next/image";
import Link from "next/link";

function AuthNavbar() {
  const { dispatch } = useModal();
  const { dispatch: ctxDispatch } = useContextMenu();

  function handleMobileMenu() {
    dispatch({
      type: ModalActionTypes.OPEN_MODAL,
      payload: ModalEnum.MOBILE_MENU,
    });
  }

  function handleCreateCollection() {
    dispatch({
      type: ModalActionTypes.OPEN_MODAL,
      payload: ModalEnum.CREATE_BOARD_MODAL,
    });
  }

  function handleContextMenu(e: React.MouseEvent) {
    ctxDispatch({
      type: ContextMenuActionTypes.OPEN_CONTEXT_MENU,
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
            <FilmIcon className="size-5" />
          </Link>

          <Link href={"#"} className="text-sm font-semibold">
            Discover
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

          <figure className="size-7 ">
            <Image
              src="https://i.pinimg.com/1200x/ff/02/39/ff02397557d58cfcf8d8529fc152c62e.jpg"
              alt="Clover from totally spies"
              width="100"
              height="100"
              className="rounded-full object-cover "
            />
          </figure>

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
