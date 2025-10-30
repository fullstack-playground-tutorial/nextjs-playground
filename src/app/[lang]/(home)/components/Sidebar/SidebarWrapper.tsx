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
import "./sidebar.css"
import type { UserSectionProps } from "./UserSection";
import { UserSection, UserSectionInternal } from "./UserSection";
import { usePathname } from "next/navigation";

type Props = {
  children:
  | React.ReactElement<MenuSectionProps | UserSectionProps>
  | React.ReactElement<MenuSectionProps | UserSectionProps>[];
  topbar: boolean;
  onToggleViewbar: () => void;
  checkAuthorized: (module: string) => boolean;
};

export default function SidebarWrapper({
  children,
  topbar,
  onToggleViewbar,
  checkAuthorized
}: Props) {
  const pathname = usePathname();
  const isSectionActive = (url: string) => {
    return pathname.startsWith(url);
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

  const clonedChildren = React.Children.map(children, (child) => {
    if (child.type === UserSection) {
      return <UserSectionInternal {...child.props as UserSectionProps} menuExpanded={menuExpand} topbar={topbar} isSectionActive={isSectionActive} />;
    } else {
      const props = child.props as MenuSectionProps;
      const isPinned = pinnedList.some(
        (pinnedItem) => pinnedItem.id === props.id
      );
      return (
        <MenuSectionInternal
          key={props.id}
          {...props}
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
    }
  });

  const renderPinnedList = () => {
    return (
      pinnedList.length > 0 && (
        <>
          {pinnedList.map((pi) => {
            return (
              <MenuSectionInternal
                key={pi.id}
                {...pi}
                topbar={topbar}
                menuExpand={menuExpand}
                handlePinnedList={handlePinnedList}
                pinned={true}
                pinnedList={pinnedList}
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
      className={`flex bg-gray-800 text-primary items-center shadow p-2 z-2 ${topbar
        ? `flex-row w-full justify-center top-0 ${menuExpand ? "fixed h-[90%]" : "sticky h-auto"
        }`
        : `fixed md:sticky flex-col h-screen overflow-y-auto scrollbar transition-all ease-in-out overflow-hidden ${menuExpand ? "w-60" : "w-14"
        }`
        }`}
    >
      <button
        className={`self-start items-center justify-center font-semibold cursor-pointer p-2 ${topbar ? "hidden h-12" : ""
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
        className={`self-start flex flex-row gap-2 items-center justify-center font-semibold cursor-pointer ${topbar ? "h-12" : "p-2 pl-2"
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
      <aside className={`flex ${topbar ? "flex-row gap-4 justify-between" : "flex-col p-2"} w-full`}>
        {renderPinnedList()}
        {clonedChildren}
      </aside>
    </nav>
  );
}
