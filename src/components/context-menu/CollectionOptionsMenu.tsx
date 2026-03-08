"use client";

import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { useModal } from "@/context/useModal";
import { useCurrentUrl } from "@/hooks/useCurrentURL";
import { ContextMenuEnum, MenuOption } from "@/types/context-menu";
import { ModalEnum } from "@/types/modal";
import { shareLink } from "@utils/share-link";
import { toast } from "sonner";

function CollectionOptionsMenu() {
  const { openModal } = useModal();
  const {
    closeMenu,
    state: { menu },
  } = useContextMenu();

  const currentUrl = useCurrentUrl();

  if (!menu) return null;

  function handleDeleteCollection() {
    const collectionSummary =
      menu?.type === ContextMenuEnum.COLLECTION_OPTIONS
        ? menu?.payload?.summary
        : null;

    if (!collectionSummary) return;

    closeMenu();

    openModal({
      type: ModalEnum.DELETE_COLLECTION,
      payload: { summary: collectionSummary },
    });
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
      onClick: handleDeleteCollection,
    },
  ];

  return <Menu items={options} />;
}

export default CollectionOptionsMenu;
