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

  const _Icon = iconName && iconSets ? iconSets[iconName] : Icon;

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
      className={`flex flex-col w-full z-1 mb-1 transition-all ${!topbar
        ? menuExpand
          ? "px-2"
          : "items-center"
        : "section-header items-center justify-center px-2"
        }`}
      key={id}
    >
      <div
        className={`flex flex-row justify-between min-h-[44px] group text-sm font-medium w-full rounded-md transition-colors duration-200
            ${!topbar && isSectionActive(url || '') ? 'bg-accent-0/10' : 'hover:bg-gray-100 dark:hover:bg-surface-2'}
        `}
      >
        {url ? (
          <Link
            href={url}
            className={`flex flex-row gap-3 cursor-pointer w-full p-2 px-3 ${topbar ? "items-center" : "items-center"
              }`}
          >
            <>
              {_Icon ? (
                <_Icon
                  className={`${isSectionActive(url)
                    ? "fill-accent-0 dark:fill-accent-0"
                    : "fill-gray-500 dark:fill-secondary group-hover:fill-gray-700 dark:group-hover:fill-primary"
                    } size-5 transition-colors duration-200`}
                />
              ) : (
                <div className="size-5"></div>
              )}
              <label
                className={`cursor-pointer whitespace-nowrap transition-colors duration-200 ${topbar ? "" : menuExpand ? "" : "hidden"
                  }
                       ${isSectionActive(url)
                    ? "text-accent-0 font-semibold"
                    : "text-gray-600 dark:text-secondary group-hover:text-gray-900 dark:group-hover:text-primary"
                  }`}
              >
                {title}
              </label>
            </>
          </Link>
        ) : (
          <div
            className={`flex flex-row gap-3 cursor-pointer w-full p-2 px-3 ${topbar ? "items-center" : "items-center"
              }`}
            onClick={() =>
              onSectionClick ? onSectionClick() : handleToggleDropdown()
            }
          >
            {_Icon ? (
              <_Icon className="size-5 fill-gray-500 dark:fill-secondary group-hover:fill-gray-700 dark:group-hover:fill-primary transition-colors duration-200" />
            ) : (
              <div className="size-5"></div>
            )}
            <label
              className={`cursor-pointer truncate text-md font-medium transition-colors duration-200 ${topbar ? "" : menuExpand ? "" : "hidden"
                } text-gray-600 dark:text-secondary group-hover:text-gray-900 dark:group-hover:text-primary`}
            >
              {title}
            </label>
          </div>
        )}
        <div
          className={`flex flex-row gap-1 pr-2 ${menuExpand ? "" : "hidden"
            } items-center`}
        >
          {!topbar && (
            <button
              className={`invisible group-hover:visible p-1 rounded-full hover:bg-gray-200 dark:hover:bg-surface-3 transition-colors`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleTogglePin();
              }}
            >
              {propPinned ? (
                <KeepIcon className={"fill-accent-0 size-3.5"} />
              ) : (
                <KeepIcon className={`rotate-45 fill-gray-400 dark:fill-secondary hover:fill-primary size-3.5`} />
              )}
            </button>
          )}
          {children && !topbar && (
            <button
              type="button"
              className="cursor-pointer size-5 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-surface-3 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleToggleDropdown();
              }}
            >
              {dropdown ? (
                <ArrowIcon className="size-2.5 rotate-180 stroke-2 stroke-gray-500 dark:stroke-secondary" />
              ) : (
                <ArrowIcon className="size-2.5 rotate-90 stroke-2 stroke-gray-500 dark:stroke-secondary" />
              )}
            </button>
          )}
        </div>
      </div>
      {clonedChildren && (
        <div
          className={`${topbar
            ? `section-list bg-white dark:bg-surface-1 border dark:border-border rounded-md shadow-lg py-1 min-w-[200px] z-50 ${path.length <= 1 ? "top-full mt-1 left-0" : "left-full top-0 ml-1"
            }`
            : `${dropdown ? "pl-4 mt-1 space-y-1" : "hidden"}`
            }`}
        >
          {clonedChildren}
        </div>
      )}
    </section>
  );
};
