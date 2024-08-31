import {
  ReactNode,
  useState,
} from "react";
import { AlertContext, AlertState,  } from "./AlertContext";




interface Props {
  children: ReactNode;
}

export default function AlertContextProvider(props: Props) {
  const [alertState, setAlertState] = useState<AlertState>({
    
  });
  return (
    <AlertContext.Provider
      value={{ alertState, setAlertState }}
    >{props.children}</AlertContext.Provider>
  );
}
