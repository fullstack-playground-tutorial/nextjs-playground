import { Suspense } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BottomBar from "./components/BottomBar";
import { Metadata } from "next";
import Loading from "../loading";
import NotificationComponent from "./components/Notification/Notification";
import { search } from "@/app/feature/notification/actions";


export  default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const notifications = await search()
  return (
   
        <div>
          <Header />
          <div className="w-full flex flex-row justify-between gap-4 p-4 h-[calc(100%-56px)]">
            <Sidebar />
            <Suspense fallback={<Loading />}>{children}</Suspense>
            <div className="right-0 top-0"></div>
          </div>
          <BottomBar />
          <div className="fixed md:hidden bottom-20 right-4 flex flex-col items-end">
            <NotificationComponent notifications={notifications} />
          </div>
          <div id="portal-modal"></div>
          <div id="portal-loading"></div>
        </div>

  );
}
