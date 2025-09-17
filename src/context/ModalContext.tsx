"use client";

import { ModalActions, ModalActionTypes } from "@/actions/ModalActions";
import { initialState, modalReducer, State } from "@/reducer/ModalReducer";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type ModalContextType = {
  state: State;
  dispatch: Dispatch<ModalActions>;
  closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

// Define the props type for the context provider component
type ContextProviderProps = {
  children: ReactNode;
};

export function ModalContextProvider({ children }: ContextProviderProps) {
  // useReducer hook to manage state with our reducer function and initial state
  const [state, dispatch] = useReducer(modalReducer, initialState);

  function closeModal() {
    dispatch({ type: ModalActionTypes.CLOSE_MODAL });
  }

  return (
    <ModalContext.Provider
      value={{
        dispatch,
        state,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
