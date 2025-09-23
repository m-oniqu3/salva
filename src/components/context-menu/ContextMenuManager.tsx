"use client";

import ContextMenu from "@/components/context-menu/ContextMenu";
import ProfileMenu from "@/components/context-menu/ProfileMenu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types";
import { ReactNode } from "react";

function ContextMenuManager() {
  const {
    state: { currentContextMenu },
    closeContextMenu,
  } = useContextMenu();

  if (!currentContextMenu) return null;

  let contentMenuContent: ReactNode = null;

  switch (currentContextMenu) {
    case ContextMenuEnum.PROFILE_MENU:
      contentMenuContent = <ProfileMenu />;
      break;

    default:
      return null;
  }

  return (
    <ContextMenu close={closeContextMenu}>{contentMenuContent}</ContextMenu>
  );
}

export default ContextMenuManager;
