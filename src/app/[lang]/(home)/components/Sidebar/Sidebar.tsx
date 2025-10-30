import TopicIcon from "./icons/topic.svg";
import AnalyticsIcon from "./icons/analytics.svg";
import ProductIcon from "./icons/product.svg";
import DashboardIcon from "./icons/dashboard.svg";
import AppleIcon from "./icons/apple.svg";
import SamsungIcon from "./icons/samsung.svg";
import TabletIcon from "./icons/tablet.svg";
import MobileIcon from "./icons/mobile.svg";
import HistoryIcon from "./icons/History.svg";
import RolesIcon from "./icons/roles.svg";
import LogIcon from "./icons/log.svg";
import Cinematic from "./icons/cinematic.svg";
import LogoutIcon from "./icons/logout.svg";
import HomeIcon from "./icons/home.svg";
import UserManagerIcon from "./icons/user_manager.svg";
import SidebarWrapper from "./SidebarWrapper";
import { MenuSection } from "./MenuSection";
import { UserSection } from "./UserSection";
import useAuth, { AuthUser } from "@/app/feature/auth";
import { useTransition } from "react";

interface Props {
  user: AuthUser;
  topbar: boolean;
  onToggleViewbar: () => void;
}

function Sidebar({ user, topbar, onToggleViewbar }: Props) {
  const [_, startTransition] = useTransition();
  const { logoutAction } = useAuth();
  const handleLogout = () => {
    startTransition(async () => {
      logoutAction();
    });
  };
  const checkAuthorized = (module: string) => {
    return user?.permissions?.some((item) => item.startsWith(module)) || false;
  };

  return (
    <SidebarWrapper
      topbar={topbar}
      checkAuthorized={checkAuthorized}
      onToggleViewbar={onToggleViewbar}
    >
      <UserSection
        name={user?.name}
        email={user?.email}
        avatarUrl={user?.avatarUrl}
      />
      <MenuSection
        id="home"
        title="Home"
        Icon={HomeIcon}
        url="/"
        checkAuthorized={() => true}
      />
      <MenuSection
        id={"dashboard"}
        title={"Dashboard"}
        Icon={DashboardIcon}
        url={"/dashboard"}
      ></MenuSection>
      <MenuSection id="product" title="Product" Icon={ProductIcon}>
        <MenuSection id="phone" title="Phone" Icon={MobileIcon}>
          <MenuSection id="samsung" title="Samsung" Icon={SamsungIcon} />
          <MenuSection id="apple" title="Apple" Icon={AppleIcon}>
            <MenuSection id="tablet" title="Tablet" Icon={TabletIcon} />
            <MenuSection id="iphone" title="IPhone" Icon={MobileIcon} />
          </MenuSection>
        </MenuSection>
      </MenuSection>
      <MenuSection id="analyitics" title="Analytics" Icon={AnalyticsIcon} />
      <MenuSection
        id="topic"
        title="Topic"
        Icon={TopicIcon}
        permission="topic.read"
      >
        <MenuSection
          id="topics"
          title="Topic"
          url="/topics"
          permission="topic.write"
        />
        <MenuSection
          id="topic-tags"
          title="Tags Management"
          url="/topics/tags"
          permission="topic.write"
        />
        <MenuSection
          id="topic-management"
          title="Topic Management"
          url="/topics/topic-management"
          permission="topic.write"
        />
      </MenuSection>
      <MenuSection id="history" title="History" Icon={HistoryIcon}>
        <MenuSection id="log" title="Log" Icon={LogIcon} />
      </MenuSection>
      <MenuSection
        id="user-management"
        permission="user_management.read"
        title="User management"
        Icon={UserManagerIcon}
      >
        <MenuSection
          id="role"
          title="Role"
          Icon={RolesIcon}
          url="/admin/roles"
          permission="user_manager.write"
        />
        <MenuSection
          id="users"
          title="Users"
          Icon={AppleIcon}
          url="/admin/users"
          permission="user_manager.write"
        />
        <MenuSection
          id="settings"
          title="Settings"
          Icon={AppleIcon}
          url="/admin/settings"
          permission="user_manager.write"
        />
      </MenuSection>
      <MenuSection
        id="cinematic"
        permission="cinematic.read"
        title="Cinematic"
        Icon={Cinematic}
        url="/cinematic"
      />
      <MenuSection
        id="logout"
        title="Logout"
        Icon={LogoutIcon}
        hidden={!user}
        onSectionClick={handleLogout}
        checkAuthorized={() => true}
      />
    </SidebarWrapper>
  );
}

export default Sidebar;
