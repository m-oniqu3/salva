import Portal from "@components/Portal";
import React from "react";

type Props = {
  children: React.ReactNode;
  close: () => void;
};

function Modal(props: Props) {
  const { children, close } = props;

  return (
    <Portal selector="#modal" close={close}>
      <div
        className="fixed p-4 w-full inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={close}
      >
        {children}
      </div>
    </Portal>
  );
}

export default Modal;
