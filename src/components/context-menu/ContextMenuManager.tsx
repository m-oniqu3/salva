"use client";

import AddElementMenu from "@/components/context-menu/AddElementMenu";
import ContextMenu from "@/components/context-menu/ContextMenu";
import EditCollectionMenu from "@/components/context-menu/EditCollectionMenu";
import ProfileMenu from "@/components/context-menu/ProfileMenu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";
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

    case ContextMenuEnum.EDIT_COLLECTION_MENU:
      contextMenuContent = <EditCollectionMenu />;
      break;

    case ContextMenuEnum.ADD_ELEMENT_MENU:
      contextMenuContent = <AddElementMenu />;
      break;

    default:
      return null;
  }

  if (!isOpen) return null;

  return (
    <ContextMenu close={closeContextMenu}>{contextMenuContent}</ContextMenu>
  );
}

export default ContextMenuManager;
