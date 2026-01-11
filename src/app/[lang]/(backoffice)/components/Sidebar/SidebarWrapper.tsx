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
      className={`flex bg-white dark:bg-surface-0 border-r dark:border-border items-center shadow-sm p-4 z-20 transition-all duration-300 ${topbar
        ? `flex-row w-full justify-center top-0 border-b dark:border-border ${menuExpand ? "fixed h-[90%]" : "sticky h-auto"
        }`
        : `fixed md:sticky flex-col h-screen overflow-y-auto scrollbar transition-all ease-in-out overflow-hidden pb-4 ${menuExpand ? "w-72" : "w-20"
        }`
        }`}
    >
      <button
        className={`self-start items-center justify-center font-semibold cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-2 transition-colors mb-4 ${topbar ? "hidden h-12" : ""
          } ${!topbar && menuExpand ? "ml-0" : "mx-auto"}`}
        onClick={(e) => handleToggleMenuExpand(e)}
      >
        {menuExpand ? (
          <CloseIcon className="stroke-gray-600 dark:stroke-secondary hover:stroke-gray-900 dark:hover:stroke-primary size-6" />
        ) : (
          <MenuIcon className="stroke-gray-600 dark:stroke-secondary hover:stroke-gray-900 dark:hover:stroke-primary size-6" />
        )}
      </button>
      <button
        className={`self-start flex flex-row gap-3 items-center justify-center font-semibold cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-surface-2 transition-colors ${topbar ? "h-12 px-4" : "p-2 w-full"
          } ${!topbar && menuExpand ? "px-3 justify-start" : "justify-center"}`}
        onClick={(e) => handleToggleViewbar(e)}
      >
        {!topbar ? (
          <>
            <SidebarIcon className="stroke-gray-600 dark:stroke-secondary size-6 shrink-0" />
            {menuExpand && <span className="text-gray-600 dark:text-secondary whitespace-nowrap">Sidebar</span>}
          </>
        ) : (
          <>
            <TopbarIcon className="stroke-gray-600 dark:stroke-secondary size-6 shrink-0" />
            {menuExpand && <span className="text-gray-600 dark:text-secondary whitespace-nowrap">Topbar</span>}
          </>
        )}
      </button>
      <aside
        className={`flex ${topbar ? "flex-row gap-4 justify-between" : "flex-col gap-1 w-full mt-2"
          }`}
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
