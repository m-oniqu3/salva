"use client";

import {
  ContextMenuAction,
  ContextMenuActionEnum,
} from "@/context/actions/ContextMenuActions";
import {
  contextMenuReducer,
  ContextState,
  initialState,
} from "@/context/reducer/ContextReducer";
import { ContextMenu } from "@/types/context-menu";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type ContextMenuContext = {
  state: ContextState;
  dispatch: Dispatch<ContextMenuAction>;
  openContextMenu(menu: ContextMenu): void;
  closeContextMenu: () => void;
};

export const ContextMenuContext = createContext<ContextMenuContext | null>(
  null
);

// Define the props type for the context provider component
type ContextProviderProps = {
  children: ReactNode;
};

export function ContextMenuProvider({ children }: ContextProviderProps) {
  // useReducer hook to manage state with our reducer function and initial state
  const [state, dispatch] = useReducer(contextMenuReducer, initialState);

  function openContextMenu(menu: ContextMenu) {
    dispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: menu,
    });
  }

  function closeContextMenu() {
    dispatch({ type: ContextMenuActionEnum.CLOSE_CONTEXT_MENU });
  }

  return (
    <ContextMenuContext.Provider
      value={{ dispatch, state, openContextMenu, closeContextMenu }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}
