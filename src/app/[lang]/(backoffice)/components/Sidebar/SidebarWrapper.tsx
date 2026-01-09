import CloseIcon from "./icons/close.svg";
import MenuIcon from "./icons/menu.svg";
import {
  MenuSectionInternal,
  type MenuSectionInternalProps,
  type MenuSectionProps,
} from "./MenuSection";
import SidebarIcon from "./icons/sidebar.svg";
import TopbarIcon from "./icons/topbar.svg";
import React, { useState } from "react";
import "./sidebar.css";
import { UserSection } from "./UserSection";
import { usePathname } from "next/navigation";
import { User } from "@/app/feature/auth";

type Props = {
  user?: User;
  menuSections: React.ReactElement<MenuSectionProps>[];
  icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;
  topbar: boolean;
  onToggleViewbar: () => void;
  checkAuthorized: (module: string) => boolean;
};

export default function SidebarWrapper({
  user,
  topbar,
  onToggleViewbar,
  checkAuthorized,
  icons,
  menuSections,
}: Props) {
  const pathname = usePathname();
  const isSectionActive = (url: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}-[A-Z]{2}/, ""); // clear locale segment
    return pathWithoutLocale == url;
  };
  const [menuExpand, setMenuExpand] = useState(true);
  const [pinnedList, setPinnedList] = useState<MenuSectionInternalProps[]>([]);

  const handleToggleMenuExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuExpand(!menuExpand);
  };

  const handleToggleViewbar = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuExpand(false);
    onToggleViewbar();
  };

  const handlePinnedList = (itemProps: MenuSectionInternalProps) => {
    const foundItem = pinnedList.find((it) => it.id === itemProps.id);
    if (foundItem) {
      setPinnedList(pinnedList.filter((it) => it.id !== itemProps.id));
    } else {
      setPinnedList([...pinnedList, { ...itemProps, pinned: true }]);
    }
  };

  const clonedChildren = React.Children.map(menuSections, (child) => {
    if (!React.isValidElement(child)) return null;
    const props = child.props as MenuSectionProps;

    const isPinned = pinnedList.some(
      (pinnedItem) => pinnedItem.id === props.id
    );
    return (
      <MenuSectionInternal
        {...props}
        key={child.key}
        iconSets={icons}
        hidden={props.hidden}
        topbar={topbar}
        menuExpand={menuExpand}
        path={[props.id]}
        handlePinnedList={handlePinnedList}
        pinned={isPinned}
        pinnedList={pinnedList}
        isSectionActive={isSectionActive}
        checkAuthorized={props.checkAuthorized || checkAuthorized}
      />
    );
  });

  const renderPinnedList = () => {
    return (
      pinnedList.length > 0 && (
        <>
          {pinnedList.map((pi) => {
            return (
              <MenuSectionInternal
                {...pi}
                topbar={topbar}
                menuExpand={menuExpand}
                handlePinnedList={handlePinnedList}
                pinned={true}
                pinnedList={pinnedList}
                iconSets={icons}
                key={pi.id}
              />
            );
          })}
          <hr className="my-2" />
        </>
      )
    );
  };
  return (
    <nav
      className={`flex bg-gray-800 text-primary items-center shadow p-2 z-2 ${
        topbar
          ? `flex-row w-full justify-center top-0 ${
              menuExpand ? "fixed h-[90%]" : "sticky h-auto"
            }`
          : `fixed md:sticky flex-col h-screen overflow-y-auto scrollbar transition-all ease-in-out overflow-hidden ${
              menuExpand ? "w-60" : "w-14"
            }`
      }`}
    >
      <button
        className={`self-start items-center justify-center font-semibold cursor-pointer p-2 ${
          topbar ? "hidden h-12" : ""
        } ${!topbar && menuExpand ? "pl-4" : ""}`}
        onClick={(e) => handleToggleMenuExpand(e)}
      >
        {menuExpand ? (
          <CloseIcon className="stroke-white mx-auto" />
        ) : (
          <MenuIcon className="stroke-white mx-auto" />
        )}
      </button>
      <button
        className={`self-start flex flex-row gap-2 items-center justify-center font-semibold cursor-pointer ${
          topbar ? "h-12" : "p-2 pl-2"
        } ${!topbar && menuExpand ? "pl-4" : ""}`}
        onClick={(e) => handleToggleViewbar(e)}
      >
        {!topbar ? (
          <>
            <SidebarIcon className="stroke-white mx-auto" />
            {menuExpand && <span>Sidebar</span>}
          </>
        ) : (
          <>
            <TopbarIcon className="stroke-white mx-auto" />
            {menuExpand && <span>Topbar</span>}
          </>
        )}
      </button>
      <aside
        className={`flex ${
          topbar ? "flex-row gap-4 justify-between" : "flex-col p-2"
        } w-full`}
      >
        {renderPinnedList()}
        <UserSection
          name={user?.username}
          email={user?.email}
          avatarUrl={user?.avatarUrl}
          menuExpanded={menuExpand}
          topbar={topbar}
          isSectionActive={isSectionActive}
        />
        {clonedChildren}
      </aside>
    </nav>
  );
}
