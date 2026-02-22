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
import FilmIcon from "./icons/film.svg";
import LogoutIcon from "./icons/logout.svg";
import HomeIcon from "./icons/home.svg";
import UserManagerIcon from "./icons/user_manager.svg";
import TagIcon from "./icons/tag.svg";
import LanguageIcon from "./icons/language.svg";
import SettingsIcon from "./icons/settings.svg";
import QuizIcon from "./icons/quiz.svg";
import SidebarWrapper from "./SidebarWrapper";
import { MenuSection, MenuSectionProps } from "./MenuSection";
import { logout, Module, UserInfo } from "@/app/feature/auth";
import { getLocaleService } from "@/app/utils/resource/locales";
import { useParams } from "next/navigation";

interface Props {
  userInfo?: UserInfo;
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
  FilmIcon,
  LogoutIcon,
  HomeIcon,
  UserManagerIcon,
  TagIcon,
  LanguageIcon,
  SettingsIcon,
  QuizIcon,
};

function Sidebar({ userInfo, topbar, onToggleViewbar }: Props) {
  const params = useParams();
  const { localize } = getLocaleService(params.lang as string);
  const modules = userInfo?.modules ?? [];
  const permissions: string[] = userInfo?.permissions ?? [];
  const user = userInfo?.user;

  const checkAuthorized = (perm: string) => {
    const authorized =
      permissions.some((item: string) => item.startsWith(perm)) || false;

    return authorized;
  };

  const renderMenuItems = (
    modules: Module[],
  ): React.ReactElement<MenuSectionProps>[] => {
    return modules.map(({ id, title, url, permission, icon, children }) => (
      <MenuSection
        key={id}
        id={id}
        title={title}
        permission={permission}
        iconName={icon}
        url={url}
      >
        {children && renderMenuItems(children)}
      </MenuSection>
    ));
  };

  return (
    <SidebarWrapper
      topbar={topbar}
      checkAuthorized={checkAuthorized}
      onToggleViewbar={onToggleViewbar}
      icons={icons}
      user={user}
      menuSections={[
        <MenuSection
          key="home"
          id="home"
          title={localize("sidebar_home")}
          iconName={"HomeIcon"}
          url="/"
          checkAuthorized={() => true}
        />,
        ...renderMenuItems(modules),
        <MenuSection
          key="settings"
          id="settings"
          title={localize("sidebar_settings")}
          iconName={"SettingsIcon"}
          hidden={!user}
          url="/settings/generals"
        />,
        <MenuSection
          key="logout"
          id="logout"
          title={localize("sidebar_logout")}
          iconName={"LogoutIcon"}
          hidden={!user}
          onSectionClick={logout}
          checkAuthorized={() => true}
        />,
      ]}
    ></SidebarWrapper>
  );
}

export default Sidebar;
