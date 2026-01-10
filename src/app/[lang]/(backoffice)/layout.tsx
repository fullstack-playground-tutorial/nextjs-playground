import BottomBar from "./components/BottomBar";
import NotificationComponent from "./components/Notification/Notification";
import { Body } from "./components/Body";
import { getUser, verifySession } from "@/app/dal";
import { UserInfo } from "@/app/feature/auth";
import ParticleBackground from "./components/ParticleBackground";

export default async function HomeLayout({
  children,
  auth,
}: {
  auth: React.ReactNode;
  children: React.ReactNode;
}) {
  let userInfo: UserInfo | undefined = undefined;
  const session = await verifySession();
  if (session == "logined") {
    userInfo = await getUser();
  }
  return (
    <>
      <Body userInfo={userInfo} children={children} />
      <ParticleBackground />

      {/* <BottomBar />
      <div className="fixed md:hidden bottom-20 right-4 flex flex-col items-end">
        <NotificationComponent notifications={[]} />
      </div> */}
      <div>{auth}</div>
    </>
  );
}
