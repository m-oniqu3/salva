"use client";

import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import ProfileMenu from "@/components/context-menu/ProfileMenu";
import {
  ArrowDownIcon,
  BookmarkIcon,
  FilmIcon,
  MenuIcon,
} from "@/components/icons";
import Searchbar from "@/components/Searchbar";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ContextMenuEnum } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import { Profile } from "@/types/user";
import { getAvatarURL } from "@utils/get-cover-url";
import Link from "next/link";

type Props = {
  profile: Profile;
};

const links = ["discover", "discuss"];

function AuthNavbar({ profile }: Props) {
  const { openModal } = useModal();
  const {
    openMenu,
    state: { menu },
  } = useContextMenu();

  const isProfileMenu = menu?.type === ContextMenuEnum.PROFILE_MENU;

  function handleProfileContextMenu() {
    openMenu({
      type: ContextMenuEnum.PROFILE_MENU,
      payload: {
        user: { userID: profile.user_id, username: profile.username },
      },
    });
  }

  function handleMobileMenu() {
    openModal({
      type: ModalEnum.MOBILE_MENU,
      payload: { profile },
    });
  }

  return (
    <div className="relative">
      <header className="flex items-center sticky top-0 left-0 h-28 z-10 bg-white w-full ">
        <nav className="wrapper grid grid-cols-[auto_1fr_auto] lg:grid-cols-3 items-center justify-between gap-8 lg:gap-6">
          <div className="flex items-center gap-4">
            <Link href="/home" className="">
              <FilmIcon className="size-6 text-neutral-800" />
            </Link>

            <ul className="hidden lg:flex gap-4 items-center">
              {links.map((link) => {
                return (
                  <Link
                    key={link}
                    href={"/" + link}
                    className="text-zinc-600 text-sml font-semibold capitalize hidden md:grid"
                  >
                    {link}
                  </Link>
                );
              })}
            </ul>
          </div>

          <div className="max-w-md mx-auto">
            <Searchbar />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleMobileMenu}
              className="flex-center lg:hidden cursor-pointer"
            >
              <MenuIcon className="size-5" />
            </button>

            {/* {!profile && (
            <div className="hidden md:flex items-center gap-4">
              <Button>Log In</Button>
              <Button className="bg-neutral-800 text-white">Sign Up</Button>
            </div>
          )} */}

            <div className="hidden lg:flex items-center gap-4">
              <Button
                onClick={() => openModal({ type: ModalEnum.CREATE_COLLECTION })}
                className="bg-neutral-800 text-white"
              >
                Create
              </Button>

              <Link href={"/films"}>
                <BookmarkIcon className="size-4" />
              </Link>

              {/* <div className="border-black border-[1.8px] rounded-full flex items-center justify-center size-7"> */}
              <Avatar
                avatar={profile.avatar ? getAvatarURL(profile.avatar) : ""}
                username={profile.username}
                name={profile.firstname || profile.username}
                className={"size-7 rounded-full text-[12px]"}
              />

              <button
                type="button"
                className="cursor-pointer"
                onClick={handleProfileContextMenu}
                name="Profile User Menu"
              >
                <ArrowDownIcon className="size-4" />
              </button>
            </div>
          </div>
        </nav>

        {isProfileMenu && (
          <div className="hidden lg:block w-full absolute top-25 z-10 ">
            <div className="relative wrapper">
              <div className="div absolute right-0">
                <ProfileMenu />
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default AuthNavbar;
