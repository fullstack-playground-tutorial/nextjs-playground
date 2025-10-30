import Link from "next/link";
import LoginIcon from "./icons/login.svg";
import AvatarIcon from "./icons/profile.svg";
export type UserSectionProps = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

export const UserSection = (_props: UserSectionProps) => {
  return <></>;
};

type UserSectionInternalProps = UserSectionProps & {
  menuExpanded: boolean;
  isSectionActive: (url: string) => boolean;
  topbar: boolean;
};

export const UserSectionInternal = (_props: UserSectionInternalProps) => {
  const { name, email, avatarUrl, menuExpanded, isSectionActive, topbar } =
    _props;
  return (
    <section
      className={`flex flex-col w-full z-1 ${
        !topbar ? (menuExpanded ? "pl-2" : "") : "section-header"
      }`}
    >
      <div className={`flex flex-row h-12 cursor-pointer items-center group`}>
        {name || email ? (
          <Link
            href={"/profile"}
            className={`flex flex-row gap-2 cursor-pointer ${
              topbar ? "items-center" : "items-end"
            }`}
          >
            {avatarUrl && avatarUrl.length > 0 ? (
              <img
                src={avatarUrl}
                className="size-6 rounded-full"
                alt={`${name}'s avatar`}
              />
            ) : (
              <AvatarIcon
                className={`${
                  isSectionActive("/login")
                    ? "fill-orange-500 stroke-orange-500"
                    : "fill-white stroke-white"
                } size-6 stroke-2`}
              />
            )}
            {menuExpanded && (
              <span className="truncate group-hover:underline">{email}</span>
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className={`flex flex-row gap-2 cursor-pointer text-sm font-semibold ${
              topbar ? "items-center" : "items-end"
            } w-full h-full`}
          >
            <LoginIcon
              className={`size-6 stroke-2 ${
                isSectionActive("/login")
                  ? "fill-orange-500 stroke-orange-500"
                  : "fill-white stroke-white"
              }`}
            />
            {menuExpanded && (
              <span className="text-white group-hover:underline">Login</span>
            )}
          </Link>
        )}
      </div>
    </section>
  );
};
