import { Link } from "@remix-run/react";
import SvgLogo from "~/assets/icons/Logo";
import { type Theme } from "~/global";
import userAvatarUrl from "../assets/image-avatar.jpg";
import ThemeSwitcher from "./common/ThemeSwitcher";

const SideNav = ({ theme }: { theme: Theme }) => {
  return (
    <div
      className="flex justify-between items-center w-full h-16 md:h-20 bg-blue-1000 lg:flex-col lg:fixed lg:top-0 lg:left-0 lg:h-full lg:w-24 lg:rounded-r-3xl relative z-50"
      id="side-nav"
    >
      <div className="flex-1">
        <SvgLogo className="w-24 h-16 md:h-20 ml-[-20px] md:ml-[-10px] lg:ml-0 lg:h-auto" />
      </div>
      <ThemeSwitcher userPreference={theme} />
      <div className="h-full w-[1px] ml-6 border-none lg:h-[1px]  lg:w-full lg:mt-8 lg:ml-0 bg-gray-1000"></div>
      <div className="px-6 lg:py-6">
        <Link to="/user">
          <div className="h-10 w-10 rounded-full">
            <img
              src={userAvatarUrl}
              alt="user avatar"
              className="w-full h-full rounded-full"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
