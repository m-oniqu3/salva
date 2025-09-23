"use client";

import {
  ContextMenuActions,
  ContextMenuActionTypes,
} from "@/actions/ContextMenuActions";
import {
  contextMenuReducer,
  ContextState,
  initialState,
} from "@/reducer/ContextReducer";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type ContextMenuContext = {
  state: ContextState;
  dispatch: Dispatch<ContextMenuActions>;
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
  console.log(state);

  function closeContextMenu() {
    dispatch({ type: ContextMenuActionTypes.CLOSE_CONTEXT_MENU });
  }

  return (
    <ContextMenuContext.Provider value={{ dispatch, state, closeContextMenu }}>
      {children}
    </ContextMenuContext.Provider>
  );
}
