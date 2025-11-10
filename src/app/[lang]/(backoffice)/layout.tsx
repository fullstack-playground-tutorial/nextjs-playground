import BottomBar from "./components/BottomBar";
import NotificationComponent from "./components/Notification/Notification";
import { Body } from "./components/Body";
import { getUser } from "@/app/dal";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const userInfo = await getUser();
    return (
      <div>
        <Body userInfo={userInfo} children={children}/>
        <BottomBar />
        <div className="fixed md:hidden bottom-20 right-4 flex flex-col items-end">
          <NotificationComponent notifications={[]} />
        </div>
      </div>
    );
  } catch (error) {
    console.log("error when trying to get user info", error);
    redirect("/auth");
  }

  
}
