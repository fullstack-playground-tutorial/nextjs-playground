"use server"
import BottomBar from "./components/BottomBar";
import NotificationComponent from "./components/Notification/Notification";
import { AuthUser, logout } from "@/app/feature/auth";
import { Body } from "./components/Body";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: AuthUser = {
    id: "",
    email: "",
    name: undefined,
    avatarUrl: undefined,
    roleId: undefined,
    permissions: [],
  };
  return (
    <div>
      <Body
        user={user}
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
