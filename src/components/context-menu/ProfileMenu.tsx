"use client";

import { useContextMenu } from "@/context/useContextMenu";

function ProfileMenu() {
  const {
    state: { menu },
  } = useContextMenu();

  const { top, left, right, bottom } = menu?.position ?? {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  return (
    <div
      className="fixed top-28 left-0 z-10 w-full"
      // style={{ top, left, right, bottom }}
    >
      <div className="wrapper flex justify-end">
        <ul
          className="context-panel bg-white border border-gray-100 w-48 h-80"
          // style={{ top, left, right, bottom }}
        >
          ProfileMenu
        </ul>
      </div>
    </div>
  );
}

export default ProfileMenu;
