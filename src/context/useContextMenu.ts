import { ContextMenuContext } from "@/context/ContextMenuContext";
import { useContext } from "react";

export function useContextMenu() {
  const context = useContext(ContextMenuContext);

  if (!context) {
    throw new Error("useContextMenu must be used within a ContextMenuProvider");
  }

  return context;
}
