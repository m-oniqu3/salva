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
  openContextMenu(menu: ContextMenu): void;
  closeContextMenu: () => void;
  updateContextMenuPosition(position: { top: number; left: number }): void;
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

  const openContextMenu = useCallback((menu: ContextMenu) => {
    dispatch({
      type: ContextMenuActionEnum.OPEN_CONTEXT_MENU,
      payload: menu,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    dispatch({ type: ContextMenuActionEnum.CLOSE_CONTEXT_MENU });
  }, []);

  const updateContextMenuPosition = useCallback(
    (position: { top: number; left: number }) => {
      dispatch({
        type: ContextMenuActionEnum.UPDATE_POSITION,
        payload: position,
      });
    },
    [],
  );

  return (
    <ContextMenuContext.Provider
      value={{
        dispatch,
        state,
        openContextMenu,
        closeContextMenu,
        updateContextMenuPosition,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}
