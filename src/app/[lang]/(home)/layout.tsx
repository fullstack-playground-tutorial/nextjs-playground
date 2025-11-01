import BottomBar from "./components/BottomBar";
import NotificationComponent from "./components/Notification/Notification";
import { AuthUser, logout } from "@/app/feature/auth";
import { Body } from "./components/Body";
import { getUser } from "@/app/dal";
import { redirect } from "next/navigation";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userInfo = await getUser()
  if(!userInfo){
    redirect("/auth")
  }

  return (
    <div>
      <Body
        user={userInfo}
        children={children}
        logoutAction={logout}
      />
      <BottomBar />
      <div className="fixed md:hidden bottom-20 right-4 flex flex-col items-end">
        <NotificationComponent notifications={[]} />
      </div>
    </div>
  );
}
