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
import CinematicIcon from "./icons/cinematic.svg";
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

const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  TopicIcon,
  AnalyticsIcon,
  ProductIcon,
  DashboardIcon,
  AppleIcon,
  SamsungIcon,
  TabletIcon,
  MobileIcon,
  HistoryIcon,
  RolesIcon,
  LogIcon,
  CinematicIcon,
  LogoutIcon,
  HomeIcon,
  UserManagerIcon,
};

function Sidebar({ user, topbar, onToggleViewbar }: Props) {
  const [_, startTransition] = useTransition();
  const { logoutAction } = useAuth();
  const handleLogout = () => {
    startTransition(async () => {
      try {
        await logoutAction();
      } catch (error) {
        throw error;
      }
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
      icons={icons}
    >
      <UserSection
        name={user?.name}
        email={user?.email}
        avatarUrl={user?.avatarUrl}
      />
      <MenuSection
        id="home"
        title="Home"
        iconName={"HomeIcon"}
        url="/"
        checkAuthorized={() => true}
      />
      <MenuSection
        id={"dashboard"}
        title={"Dashboard"}
        iconName={"DashboardIcon"}
        url={"/dashboard"}
      ></MenuSection>
      <MenuSection id="product" title="Product" iconName={"ProductIcon"}>
        <MenuSection id="phone" title="Phone" iconName={"MobileIcon"}>
          <MenuSection id="samsung" title="Samsung" iconName={"SamsungIcon"} />
          <MenuSection id="apple" title="Apple" iconName={"AppleIcon"}>
            <MenuSection id="tablet" title="Tablet" iconName={"TabletIcon"} />
            <MenuSection id="iphone" title="IPhone" iconName={"MobileIcon"} />
          </MenuSection>
        </MenuSection>
      </MenuSection>
      <MenuSection id="analyitics" title="Analytics" iconName={"AnalyticsIcon"} />
      <MenuSection
        id="topic"
        title="Topic"
        iconName={"TopicIcon"}
        permission="topic.read"
      >
        <MenuSection
          id="topics"
          title="Topic"
          url="/topics"
          permission="topic.read"
        />
        <MenuSection
          id="topic-tags"
          title="Tags Management"
          url="/topics/tags"
          permission="topic.write"
        />
        <MenuSection
          id="topic_management"
          title="Topic Management"
          url="/topics/topic-management"
          permission="topic.write"
        />
      </MenuSection>
      <MenuSection id="history" title="History" iconName={"HistoryIcon"}>
        <MenuSection id="log" title="Log" iconName={"LogIcon"} />
      </MenuSection>
      <MenuSection
        id="user-management"
        permission="user_management.read"
        title="User management"
        iconName={"UserManagerIcon"}
      >
        <MenuSection
          id="role"
          title="Role"
          iconName={"RolesIcon"}
          url="/admin/roles"
          permission="user_manager.write"
        />
        <MenuSection
          id="users"
          title="Users"
          iconName={"AppleIcon"}
          url="/admin/users"
          permission="user_manager.write"
        />
        <MenuSection
          id="settings"
          title="Settings"
          iconName={"AppleIcon"}
          url="/admin/settings"
          permission="user_manager.write"
        />
      </MenuSection>
      <MenuSection
        id="cinematic"
        permission="cinematic.read"
        title="Cinematic"
        iconName={"CinematicIcon"}
        url="/cinematic"
      />
      <MenuSection
        id="logout"
        title="Logout"
        iconName={"LogoutIcon"}
        hidden={!user}
        onSectionClick={handleLogout}
        checkAuthorized={() => true}
      />
    </SidebarWrapper>
  );
}

export default Sidebar;
