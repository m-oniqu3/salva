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
      {children}
    </Portal>
  );
}

export default ContextMenu;
