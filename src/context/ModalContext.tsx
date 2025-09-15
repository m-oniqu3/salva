"use client";

import { ModalActions } from "@/actions/ModalActions";
import { initialState, modalReducer, State } from "@/reducer/ModalReducer";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type ModalContextType = {
  state: State;
  dispatch: Dispatch<ModalActions>;
};

export const ModalContext = createContext<ModalContextType | null>(null);

// Define the props type for the context provider component
type ContextProviderProps = {
  children: ReactNode;
};

export function ModalContextProvider({ children }: ContextProviderProps) {
  // useReducer hook to manage state with our reducer function and initial state
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalContext.Provider
      value={{
        dispatch,
        state,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
