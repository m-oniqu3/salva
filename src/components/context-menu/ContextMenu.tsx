import Portal from "@/components/Portal";
import React from "react";

type Props = {
  children: React.ReactNode;
  close: () => void;
};

function ContextMenu(props: Props) {
  const { children, close } = props;

  return (
    <Portal selector="#context-menu" close={close}>
      <div
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          visibility: "visible",
          transform: `translate(0, -30px)`,
          willChange: "transform",
          zIndex: "50",
        }}
      >
        {children}
      </div>
    </Portal>
  );
}

export default ContextMenu;
