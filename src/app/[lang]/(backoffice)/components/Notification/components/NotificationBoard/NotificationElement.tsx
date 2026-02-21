"use server";
import { getLocaleService } from "@/app/utils/resource/locales";
import { Sprintf } from "@/app/utils/string";
import { accept, reject } from "@/app/feature/friend/actions";
import { Notification } from "@/app/feature/notification/notification";
import { cookies } from "next/headers";

interface Props {
  noti: Notification;
  lang?: string;
}

export async function NotificationElement({ noti, lang }: Props) {
  const userId = (await cookies()).get("userId")?.value;
  const { localize } = getLocaleService(lang);
  const onAcceptClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (noti.requester && noti.requester.id) {
      return accept(noti.requester.id);
    }
  };

  const onRejectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (noti.requester && noti.requester.id) {
      reject(noti.requester.id);
    }
  };

  const renderContent = () => {
    let contentString = noti.content;
    switch (noti.content) {
      case "add_friend":
        contentString = Sprintf(localize(noti.content), noti.requester.name);
        break;
      case "accept_friend":
        contentString = Sprintf(localize(noti.content), noti.requester.name);
        break;
      case "reject_friend":
        contentString = Sprintf(localize(noti.content), noti.requester.name);
        break;
      case "your_accept_friend":
        contentString = Sprintf(localize(noti.content), noti.requester.name);
        break;
      case "your_reject_friend":
        contentString = Sprintf(localize(noti.content), noti.requester.name);
        break;
      default:
        break;
    }

    return contentString;
  };

  const renderColor = () => {
    if (userId) {
      const subscriber = noti.subscribers.find(
        (subscriber) => subscriber.id == userId,
      );
      if (subscriber) {
        return subscriber.readed
          ? "bg-yellow-200 hover:bg-yellow-300"
          : "bg-yellow-100  hover:bg-yellow-200";
      }
      return "";
    }
  };
  return (
    <div
      className={`flex flex-row gap-2 items-center rounded-lg  ${renderColor()} p-2 border hover:border-black`}
    >
      <div className="flex-initial shadow-md items-center justify-center h-8 w-8 rounded-full bg-glass-200 border border-t-glass-500 border-l-glass-500 border-r-glass-200 border-b-glass-200">
        <img
          className="h-full w-full rounded-full border-2 border-white"
          src="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
          alt=""
          srcSet="https://i.pinimg.com/736x/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg"
        />
      </div>
      <div
        className={`flex flex-1 flex-col gap-2 p-2 border border-l-glass-600 bg-scroll border-t-glass-600 border-r-glass-300 border-b-glass-300 backdrop-blur-md rounded-lg shadow-xl`}
        key={noti.id}
      >
        <p className="text-sm">{renderContent()}</p>
        {noti.type == "addfriend" && (
          <div className="flex flex-row gap-2 justify-center">
            <div
              className="rounded-full w-8 h-8 text-white bg-green-400 shadow-md p-2 flex items-center justify-center cursor-pointer"
              onClick={(e) => onAcceptClick(e)}
            >
              v
            </div>
            <div
              className="rounded-full w-8 h-8 text-white bg-red-400 shadow-md p-2 flex items-center justify-center  cursor-pointer"
              onClick={(e) => onRejectClick(e)}
            >
              X
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
