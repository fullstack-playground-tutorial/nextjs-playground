import BottomBar from "./components/BottomBar";
import { Body } from "./components/Body";
import { getUser, verifySession } from "@/app/dal";
import { UserInfo } from "@/app/feature/auth";
import ParticleBackground from "./components/ParticleBackground";

export default async function HomeLayout({
  children,
  auth,
  notificationQueue,
  notificationCenter,
}: {
  auth: React.ReactNode;
  children: React.ReactNode;
  notificationQueue: React.ReactNode;
  notificationCenter: React.ReactNode;
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

      <BottomBar />
      <div>{auth}</div>
      <div>{notificationQueue}</div>
      <div>{notificationCenter}</div>
    </>
  );
}
