import { Notification } from "@/app/feature/notification/notification";
import "./notification-board.css";
import { NotificationElement } from "./NotificationElement";

interface Props {
  visible: boolean;
  notifications: Notification[];
}

export default function NotificationBoard(props: Props) {
  return (
    <div
      className={`transition-[visibility,_opacity] flex flex-col delay-100 duration-300 bg-glass-100 p-2 ease-in-out shadow-lg rounded-xl over overflow-y-auto min-h-40 max-h-80 w-64 gap-2 border border-l-glass-500 overflow-clip no-scroll  border-t-glass-500 border-r-glass-200 border-b-glass-200 backdrop-blur-md ${
        props.visible ? "visible opacity-1" : "invisible opacity-0"
      }`}
    >
      {props.notifications.length > 0 ? (
        props.notifications.map((item) => (
          <NotificationElement noti={item} key={item.id} />
        ))
      ) : (
        <div className="text-justify m-auto text-white w-25 text-sm">
          Tạm thời không có thông báo mới
        </div>
      )}
    </div>
  );
}
