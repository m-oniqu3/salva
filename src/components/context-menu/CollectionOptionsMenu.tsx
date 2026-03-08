"use client";

import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { useCurrentUrl } from "@/hooks/useCurrentURL";
import { ContextMenuEnum, MenuOption } from "@/types/context-menu";
import { shareLink } from "@utils/share-link";
import { toast } from "sonner";

function CollectionOptionsMenu() {
  const { openModal } = useModal();
  const {
    closeMenu,
    stopPropagation,
    state: { menu },
  } = useContextMenu();
  const currentUrl = useCurrentUrl();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.COLLECTION_OPTIONS) return null;

  const collectionSummary = menu.payload!.summary;

  function deleteCollection() {
    console.log("Deleting collection...");
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
      onClick: deleteCollection,
    },
  ];

  return <Menu items={options} />;
}

export default CollectionOptionsMenu;
