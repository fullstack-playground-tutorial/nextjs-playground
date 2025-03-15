"use client";
import { Notification } from "@/app/feature/notification/notification";
import { useEffect, useState } from "react";
import NotificationBoard from "./components/NotificationBoard";
import { CloudIcon } from "./components/CloudIcon/CloudIcon";

interface Props {
  notifications: Notification[];
}

interface InternalState {
  toggle: boolean;
  notifications: Notification[];
}

interface SocketMsg {
  name: string;
  data: any;
}

const initialState: InternalState = {
  toggle: false,
  notifications: [],
};

export default function NotificationComponent(props: Props) {
  const [state, setState] = useState(initialState);

  function onToggle(e: React.MouseEvent) {
    e.preventDefault();
    setState((prev) => ({ ...prev, toggle: !prev.toggle }));
  }
  useEffect(() => {}, []);
  return (
    <>
      <NotificationBoard visible={state.toggle} notifications={[]} />
      <div onClick={(e) => onToggle(e)}>
        <CloudIcon notificationTotal={state.notifications.length} />
      </div>
    </>
  );
}
