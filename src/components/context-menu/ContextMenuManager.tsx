"use client";

import AddElementMenu from "@/components/context-menu/AddElementMenu";
import CollectionActionsMenu from "@/components/context-menu/CollectionActionsMenu";
import ContextMenu from "@/components/context-menu/ContextMenu";
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

    case ContextMenuEnum.COLLECTION_ACTIONS_MENU:
      contextMenuContent = (
        <CollectionActionsMenu closeContextMenu={closeContextMenu} />
      );
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
