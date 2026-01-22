"use client";

import Portal from "@/components/Portal";
import { useContextMenu } from "@/context/useContextMenu";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  closeMenu: () => void;
};

function ContextMenu(props: Props) {
  const { children, closeMenu } = props;
  const [isMobile, setisMobile] = useState(false);
  const {
    state: { menu },
  } = useContextMenu();

  // Close menu when the route changes
  useEffect(() => {
    const handlePopState = () => {
      closeMenu();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [closeMenu]);

  // Show context menu as modal on small screens. Otherwise position the context menu
  useEffect(() => {
    function positionMenu() {
      if (window.innerWidth < 400) {
        setisMobile(true);
      } else setisMobile(false);
    }

    positionMenu();
    window.addEventListener("resize", positionMenu);

    return () => {
      window.removeEventListener("resize", positionMenu);
    };
  }, []);

  if (!menu) return null;

  const { top, left, right, bottom } = menu.position;

  return (
    <Portal selector="#context-menu" close={closeMenu}>
      {isMobile && (
        <div
          className="fixed p-4 w-full inset-0 z-50 flex items-end justify-center bg-black/70"
          onClick={closeMenu}
        >
          {children}
        </div>
      )}

      {!isMobile && <div>{children}</div>}
    </Portal>
  );
}

export default ContextMenu;
