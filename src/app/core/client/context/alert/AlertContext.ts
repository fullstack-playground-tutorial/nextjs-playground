"use client"
import { createContext, Dispatch, SetStateAction } from "react";

/**
 * State interface for alert toast
 */
export interface AlertState {
  message?: string;
  title?: string;
  onClose?: () => void;
  visible?: boolean;
}

/**
 * type interface for alert context
 */
export interface AlertContext {
  alertState: AlertState;
  setAlertState: Dispatch<SetStateAction<AlertState>>;
}

export const AlertContext = createContext<AlertContext>({
  alertState: {},
  setAlertState: (value) => {},
});
