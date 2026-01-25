"use client";

import AddElementMenu from "@/components/context-menu/AddElementMenu";
import CollectionOptionsMenu from "@/components/context-menu/CollectionOptionsMenu";
import CollectionPickerMenu from "@/components/context-menu/CollectionPickerMenu";
import ContextMenu from "@/components/context-menu/ContextMenu";
import ProfileMenu from "@/components/context-menu/ProfileMenu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";

function ContextMenuManager() {
  const {
    state: { menu },
    closeContextMenu,
  } = useContextMenu();

  const renderedMenu = (() => {
    if (!menu) return null;

    switch (menu.type) {
      case ContextMenuEnum.PM:
        return <ProfileMenu />;

      case ContextMenuEnum.COM:
        return <CollectionOptionsMenu />;

      case ContextMenuEnum.AEM:
        return <AddElementMenu />;

      case ContextMenuEnum.CPM:
        return <CollectionPickerMenu />;

      default:
        return null;
    }
  })();

  if (!renderedMenu) return null;

  return <ContextMenu closeMenu={closeContextMenu}>{renderedMenu}</ContextMenu>;
}

export default ContextMenuManager;
