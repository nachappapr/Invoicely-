import { Link } from "@remix-run/react";
import { LogOut, Settings } from "lucide-react";
import { type Theme } from "~/global";
import userAvatarUrl from "../../assets/images/user-avatar.jpg";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import NavigationListItem from "./NavigationListItem";

const DesktopNavigationMenuItems = ({
  theme,
  isLoggedIn,
}: {
  theme: Theme;
  isLoggedIn: boolean;
}) => {
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
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-1000 dark:text-white-1000 hover:text-purple-1000 dark:hover:text-purple-1050">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr] bg-white-1000 dark:bg-blue-2000">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-1050 to-purple-1000 p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mt-4 text-lg font-medium text-white">
                      Invoicely
                    </div>
                    <p className="text-sm leading-tight text-white/90">
                      Simplify your invoicing process with our powerful tools.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <NavigationListItem
                href="/features/create"
                title="Create Invoices"
              >
                Easily create professional invoices in minutes.
              </NavigationListItem>
              <NavigationListItem href="/features/track" title="Track Payments">
                Keep track of all your payments in one place.
              </NavigationListItem>
              <NavigationListItem
                href="/features/reports"
                title="Generate Reports"
              >
                Get insights with detailed financial reports.
              </NavigationListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-gray-1000 dark:text-white-1000 hover:text-purple-1000 dark:hover:text-purple-1050">
            Pricing
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white-1000 dark:bg-blue-2000">
              {[
                {
                  title: "Free Plan",
                  description: "Perfect for small businesses and freelancers.",
                  href: "/pricing/free",
                },
                {
                  title: "Pro Plan",
                  description: "Advanced features for growing businesses.",
                  href: "/pricing/pro",
                },
                {
                  title: "Enterprise Plan",
                  description: "Custom solutions for large organizations.",
                  href: "/pricing/enterprise",
                },
                {
                  title: "Compare Plans",
                  description: "See all features side by side.",
                  href: "/pricing/compare",
                },
              ].map((plan) => (
                <NavigationListItem
                  key={plan.title}
                  title={plan.title}
                  href={plan.href}
                >
                  {plan.description}
                </NavigationListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher userPreference={theme} />
        {renderLogin()}
      </div>
    </NavigationMenu>
  );
};

export default DesktopNavigationMenuItems;
