"use client";

import AddElementMenu from "@/components/context-menu/AddElementMenu";
import ContextMenu from "@/components/context-menu/ContextMenu";
import EditBoardMenu from "@/components/context-menu/EditBoardMenu";
import ProfileMenu from "@/components/context-menu/ProfileMenu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types";
import { ReactNode } from "react";

function ContextMenuManager() {
  const {
    state: { currentContextMenu, isOpen },
    closeContextMenu,
  } = useContextMenu();

  if (!currentContextMenu) return null;

  let contextMenuContent: ReactNode = null;

  switch (currentContextMenu) {
    case ContextMenuEnum.PROFILE_MENU:
      contextMenuContent = <ProfileMenu />;
      break;

    case ContextMenuEnum.EDIT_BOARD_MENU:
      contextMenuContent = <EditBoardMenu />;
      break;

    case ContextMenuEnum.ADD_ELEMENT_MENU:
      contextMenuContent = <AddElementMenu />;
      break;

    default:
      return null;
  }

  if (!isOpen) return null;

  return (
    <ContextMenu close={closeContextMenu} isOpen={isOpen}>
      {contextMenuContent}
    </ContextMenu>
  );
}

export default ContextMenuManager;
