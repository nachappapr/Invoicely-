import { Link } from "@remix-run/react";
import { LogOut, Settings } from "lucide-react";
import SvgLogo from "~/assets/icons/Logo";
import { type Theme } from "~/global";
import userAvatarUrl from "../../assets/image-avatar.jpg";
import ThemeSwitcher from "../common/ThemeSwitcher";
import UserAvatarButton from "../common/UserAvatarButton";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DesktopNavigationMenuItems from "./DesktopNavigationMenuItems";
import MobileNavigation from "./MobileNavigationMenuItems";

const SideNav = ({ theme }: { theme: Theme }) => {
  const isLoggedIn = true;
  const renderLogin = () => {
    return isLoggedIn ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <UserAvatarButton imageUrl={userAvatarUrl} fallbackText="NR" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem asChild>
            <Link to="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <Button
        variant="secondary"
        className="bg-purple-1000 text-white hover:bg-purple-1050"
      >
        Log in
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-1000 dark:bg-blue-2000">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <SvgLogo />
          <span className="font-bold text-2xl text-white-1000">Invoicely</span>
        </Link>
        <div className="hidden md:block">
          <DesktopNavigationMenuItems isLoggedIn={isLoggedIn} theme={theme} />
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher userPreference={theme} />
          {renderLogin()}
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
};

export default SideNav;
