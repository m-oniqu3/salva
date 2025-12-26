"use client";

import Portal from "@/components/Portal";
import { useContextMenu } from "@/context/useContextMenu";
import React, { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  close: () => void;
};

function ContextMenu(props: Props) {
  const { children, close } = props;
  const [isMobile, setisMobile] = useState(false);
  const {
    state: { menu },
  } = useContextMenu();

  // Show context menu as modal on small screens. Otherwise position the context menu
  useEffect(() => {
    function positionMenu() {
      const windowWidth = window.innerWidth;

      if (windowWidth < 400) {
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

  const { x, y } = menu.position;

  return (
    <Portal selector="#context-menu" close={close}>
      {isMobile && (
        <div
          className="fixed p-4 w-full inset-0 z-50 flex items-end justify-center bg-black/70"
          onClick={close}
        >
          {children}
        </div>
      )}

      {!isMobile && (
        <div className="absolute" style={{ top: y, left: x }}>
          {children}
        </div>
      )}
    </Portal>
  );
}

export default ContextMenu;
