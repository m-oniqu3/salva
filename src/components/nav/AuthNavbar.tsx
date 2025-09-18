"use client";

import { ModalActionTypes } from "@/actions/ModalActions";
import { FilmIcon, MenuIcon } from "@/components/icons";
import Searchbar from "@/components/Searchbar";
import { useModal } from "@/context/useModal";
import { ModalEnum } from "@/types";
import Link from "next/link";

function AuthNavbar() {
  const { dispatch } = useModal();

  function handleMobileMenu() {
    dispatch({
      type: ModalActionTypes.OPEN_MODAL,
      payload: ModalEnum.MOBILE_MENU,
    });
  }
  return (
    <header className="flex items-center h-20 ">
      <nav className="wrapper flex items-center gap-6 md:gap-6 ">
        <Link href="/">
          <FilmIcon className="size-5" />
        </Link>

        <Link href={"#"} className="text-sm">
          Discover
        </Link>

        <Searchbar />
        <button type="button" onClick={handleMobileMenu}>
          <MenuIcon className="size-5" />
        </button>
      </nav>
    </header>
  );
}

export default AuthNavbar;
