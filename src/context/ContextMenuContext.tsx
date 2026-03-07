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
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useReducer,
} from "react";

type ContextMenuContext = {
  state: ContextState;
  dispatch: Dispatch<ContextMenuAction>;
  openMenu(menu: ContextMenu): void;
  closeMenu: () => void;
  stopPropagation: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

export const ContextMenuContext = createContext<ContextMenuContext | null>(
  null,
);

// Define the props type for the context provider component
type ContextProviderProps = {
  children: ReactNode;
};

export function ContextMenuProvider({ children }: ContextProviderProps) {
  // useReducer hook to manage state with our reducer function and initial state
  const [state, dispatch] = useReducer(contextMenuReducer, initialState);

  const openMenu = useCallback((menu: ContextMenu) => {
    dispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: menu,
    });
  }, []);

  const closeMenu = useCallback(() => {
    dispatch({ type: ContextMenuActionEnum.CLOSE_CONTEXT_MENU });
  }, []);

  function stopPropagation(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <ContextMenuContext.Provider
      value={{ dispatch, state, openMenu, closeMenu, stopPropagation }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}
