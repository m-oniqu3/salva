"use client";

import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { ContextMenuEnum } from "@/types/context-menu";

function CollectionOptionsMenu() {
  const { openModal } = useModal();
  const {
    closeMenu,
    stopPropagation,
    state: { menu },
  } = useContextMenu();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.COLLECTION_OPTIONS) return null;
  if (!menu.payload?.summary)
    throw new Error(
      "Collection Summary must be provided to" + CollectionOptionsMenu.name,
    );

  const collectionSummary = menu.payload.summary;

  function deleteCollection() {
    console.log("Deleting collection...");
  }

  const options = [
    { label: "Share", onClick: () => {} },
    {
      label: "Delete",
      className: "text-red-600 hover:bg-red-700/50 hover:text-white",
      onClick: deleteCollection,
    },
  ];

  return <Menu items={options} />;
}

export default CollectionOptionsMenu;
