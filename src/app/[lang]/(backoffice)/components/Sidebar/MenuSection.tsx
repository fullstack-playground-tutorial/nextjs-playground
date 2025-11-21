import React, { useState } from "react";
import KeepIcon from "./icons/keep.svg";
import ArrowIcon from "./icons/arrow.svg";
import Link from "next/link";

export type MenuSectionProps = {
  id: string; // use module name for authorization
  title: string;
  iconName?: string;
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
  iconSets?: Record<string, React.FC<React.SVGProps<SVGSVGElement>>>;
  topbar: boolean;
  menuExpand: boolean;
  path: string[];
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
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
    iconName,
    iconSets,
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

  const _Icon = (iconName && iconSets) ? iconSets[iconName] : Icon;

  if (props.hidden || (checkAuthorized && !checkAuthorized(permission || ""))) {
    return null;
  }

  const clonedChildren = !children
    ? undefined
    : React.Children.map(children, (child) => {
      const isChildPinned = pinnedList.some(
        (pinnedItem) => pinnedItem.id === child.props.id
      );
      return (
        <MenuSectionInternal
          {...child.props}
          iconSets={iconSets}
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
      className={`flex flex-col w-full z-1 ${!topbar
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
            className={`flex flex-row gap-2 cursor-pointer ${topbar ? "items-center" : "items-end"
              }`}
          >
            <>
              {_Icon ?
                <_Icon
                  className={`${isSectionActive(url)
                    ? "fill-orange-500 stroke-orange-500"
                    : "fill-white stroke-white"
                    } size-6 stroke-2`}
                /> : <div className="size-6"></div>
              }
              <label
                className={`hover:underline cursor-pointer ${topbar ? "" : menuExpand ? "" : "hidden"
                  }
                       ${isSectionActive(url)
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
            className={`flex flex-row gap-2 cursor-pointer hover:underline ${topbar ? "items-center" : "items-end"
              } font-semibold`}
            onClick={() =>
              onSectionClick ? onSectionClick() : handleToggleDropdown()
            }
          >
            {_Icon ? <_Icon className="size-6 stroke-white" /> : <div className="size-6"></div>}
            <label
              className={`text-white cursor-pointer truncate text-md ${topbar ? "" : menuExpand ? "" : "hidden"
                }`}
            >
              {title}
            </label>
          </div>
        )}
        <div
          className={`flex flex-row gap-2 ${menuExpand ? "" : "hidden"
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
          className={`${topbar
            ? `section-list bg-gray-800 text-white px-2 shadow-md min-w-[200px] ${path.length <= 1 ? "top-full" : "left-full"
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
