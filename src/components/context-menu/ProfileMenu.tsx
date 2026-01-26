"use client";

import { useContextMenu } from "@/context/useContextMenu";
import { ContextMenuEnum } from "@/types/context-menu";

function ProfileMenu() {
  const {
    state: { menu },
  } = useContextMenu();

  if (!menu) return null;
  if (menu.type !== ContextMenuEnum.PM) return null;

  const { top, right } = menu.position;

  return (
    <ul
      className="absolute z-10 context-panel border border-gray-100 w-48 h-80"
      style={{ top, right }}
    >
      ProfileMenu
    </ul>
  );
}

export default ProfileMenu;
