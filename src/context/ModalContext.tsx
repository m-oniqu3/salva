"use client";

import { ModalActionEnum, ModalActions } from "@/context/actions/ModalActions";
import {
  initialState,
  modalReducer,
  State,
} from "@/context/reducer/ModalReducer";
import { Modal } from "@/types/modal";
import { createContext, Dispatch, ReactNode, useReducer } from "react";

type ModalContextType = {
  state: State;
  dispatch: Dispatch<ModalActions>;
  openModal(modal: Modal): void;
  closeModal: () => void;
  stopPropagation(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
};

export const ModalContext = createContext<ModalContextType | null>(null);

// Define the props type for the context provider component
type ContextProviderProps = {
  children: ReactNode;
};

export function ModalContextProvider({ children }: ContextProviderProps) {
  // useReducer hook to manage state with our reducer function and initial state
  const [state, dispatch] = useReducer(modalReducer, initialState);

  function openModal(modal: Modal) {
    dispatch({
      type: ModalActionEnum.OPEN_MODAL,
      payload: modal,
    });
  }

  function closeModal() {
    dispatch({ type: ModalActionEnum.CLOSE_MODAL });
  }

  function stopPropagation(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <ModalContext.Provider
      value={{
        dispatch,
        state,
        openModal,
        closeModal,
        stopPropagation,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
