import Menu from "@/components/context-menu/Menu";
import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";

function SortCollectionPreviews() {
  const {
    openMenu,
    state: { menu },
  } = useContextMenu();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.SORT_COLLECTION_PREVIEWS) return null;

  const options = [
    { label: "Default", onClick: () => {} },
    { label: "A to Z", onClick: () => {} },
    { label: "Last Saved To", onClick: () => {} },
  ];

  return <Menu heading="Sort by" items={options} />;
}

export default SortCollectionPreviews;
