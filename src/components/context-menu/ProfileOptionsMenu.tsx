"use client";

import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { useCurrentUrl } from "@/hooks/useCurrentURL";
import { ContextMenuEnum, MenuOption } from "@/types/context-menu";
import { shareLink } from "@utils/share-link";
import { toast } from "sonner";

function ProfileOptionsMenu() {
  const {
    closeMenu,
    state: { menu },
  } = useContextMenu();

  const currentUrl = useCurrentUrl();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.PROFILE_OPTIONS) return null;

  function deleteProfile() {
    console.log("Deleting profile...");
  }

  function handleShare() {
    if (!currentUrl) return;

    shareLink(currentUrl)
      .then(() => {
        toast("Link copied!");
        closeMenu();
      })
      .catch(() => toast("Failed to copy link"));
  }

  const options: MenuOption[] = [
    { label: "Share", onClick: handleShare },
    {
      label: "Delete",
      className: "text-red-600 hover:bg-red-700/50 hover:text-white",
      onClick: deleteProfile,
    },
  ];

  return <Menu items={options} />;
}

export default ProfileOptionsMenu;
