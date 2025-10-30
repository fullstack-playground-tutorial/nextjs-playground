import React, { useState } from "react";
import KeepIcon from "./icons/keep.svg";
import ArrowIcon from "./icons/arrow.svg";
import Link from "next/link";

export type MenuSectionProps = {
  id: string; // use module name for authorization
  title: string;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  children?:
    | React.ReactElement<MenuSectionProps>
    | React.ReactElement<MenuSectionProps>[];
  url?: string;
  hidden?: boolean;
  disable?: boolean;
  onSectionClick?: () => void;
  checkAuthorized?: (module: string) => boolean; // override checkAuthorized from SidebarWrapper
  permission?: string;
};

type _MenuSectionProps = {
  topbar: boolean;
  menuExpand: boolean;
  path: string[];
  handlePinnedList?: (item: MenuSectionInternalProps) => void;
  pinned: boolean;
  pinnedList?: MenuSectionInternalProps[];
  isSectionActive: (url: string) => boolean;
};

export type MenuSectionInternalProps = MenuSectionProps & _MenuSectionProps;
export const MenuSection = (_props: MenuSectionProps) => {
  return <></>;
};
export const MenuSectionInternal = (props: MenuSectionInternalProps) => {
  const {
    id,
    title,
    Icon,
    children,
    url,
    permission,
    isSectionActive,
    path,
    topbar,
    menuExpand,
    disable,
    handlePinnedList,
    pinned: propPinned = false,
    pinnedList = [],
    onSectionClick,
    checkAuthorized,
  } = props;
  if (props.hidden || (checkAuthorized && !checkAuthorized(permission || "")))
    return null;
  const clonedChildren = !children
    ? undefined
    : React.Children.map(children, (child) => {
        const isChildPinned = pinnedList.some(
          (pinnedItem) => pinnedItem.id === child.props.id
        );
        return (
          <MenuSectionInternal
            key={child.props.id}
            {...child.props}
            topbar={topbar}
            menuExpand={menuExpand}
            path={[...path, child.props.id]}
            pinned={isChildPinned}
            handlePinnedList={handlePinnedList}
            pinnedList={pinnedList}
            isSectionActive={isSectionActive}
            disable={disable}
          />
        );
      });

  const [dropdown, setDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const handleTogglePin = () => {
    handlePinnedList?.({ ...props, pinned: !propPinned });
  };

  return (
    <section
      className={`flex flex-col w-full z-1 ${
        !topbar
          ? menuExpand
            ? "pl-2"
            : ""
          : "section-header items-center justify-center"
      }`}
      key={id}
    >
      <div className="flex flex-row justify-between h-12 group text-sm font-semibold">
        {url ? (
          <Link
            href={url}
            className={`flex flex-row gap-2 cursor-pointer ${
              topbar ? "items-center" : "items-end"
            }`}
          >
            <>
              {Icon && (
                <Icon
                  className={`${
                    isSectionActive(url)
                      ? "fill-orange-500 stroke-orange-500"
                      : "fill-white stroke-white"
                  } size-6 stroke-2`}
                />
              )}
              <label
                className={`hover:underline cursor-pointer ${
                  topbar ? "" : menuExpand ? "" : "hidden"
                }
                       ${
                         isSectionActive(url)
                           ? "text-orange-500 font-semibold"
                           : "text-white"
                       }`}
              >
                {title}
              </label>
            </>
          </Link>
        ) : (
          <div
            className={`flex flex-row gap-2 cursor-pointer hover:underline ${
              topbar ? "items-center" : "items-end"
            } font-semibold`}
            onClick={() =>
              onSectionClick ? onSectionClick() : handleToggleDropdown()
            }
          >
            {Icon && <Icon className="stroke-white" />}
            <label
              className={`text-white cursor-pointer truncate text-md max-w-2/3 ${
                topbar ? "" : menuExpand ? "" : "hidden"
              }`}
            >
              {title}
            </label>
          </div>
        )}
        <div
          className={`flex flex-row gap-2 ${
            menuExpand ? "" : "hidden"
          } items-end stroke-white`}
        >
          {!topbar && (
            <button
              className={`invisible group-hover:visible`}
              onClick={() => handleTogglePin()}
            >
              {propPinned ? (
                <KeepIcon className={"fill-white"} />
              ) : (
                <KeepIcon className={`rotate-45 "fill-white"`} />
              )}
            </button>
          )}
          {children && !topbar && (
            <button
              type="button"
              className="cursor-pointer size-4 flex"
              onClick={() => handleToggleDropdown()}
            >
              {dropdown ? (
                <ArrowIcon className=" size-full rotate-180 stroke-2 stroke-white" />
              ) : (
                <ArrowIcon className="size-full rotate-90 stroke-2 stroke-white" />
              )}
            </button>
          )}
        </div>
      </div>
      {clonedChildren && (
        <div
          className={`${
            topbar
              ? `section-list bg-gray-800 text-white px-2 shadow-md min-w-[200px] ${
                  path.length <= 1 ? "top-full" : "left-full"
                }`
              : `${dropdown ? "" : "hidden"}`
          }`}
        >
          {clonedChildren}
        </div>
      )}
    </section>
  );
};
