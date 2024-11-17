import { Link } from "@remix-run/react";
import clsx from "clsx";
import { forwardRef } from "react";
import SvgLogo from "~/assets/icons/Logo";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { type Theme } from "~/global";
import userAvatarUrl from "../../assets/image-avatar.jpg";
import ThemeSwitcher from "../common/ThemeSwitcher";
import { Avatar, AvatarImage } from "../ui/avatar";
import { END_POINTS } from "~/constants";

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={clsx(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-1000 hover:text-purple-1000 focus:bg-indigo-1000 focus:text-purple-1000",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-2000">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const UserAvatarButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    imageUrl: string;
    fallbackText: string;
  }
>(({ imageUrl, fallbackText, ...props }, ref) => (
  <button
    ref={ref}
    className="w-10 h-10 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-1000 focus:ring-offset-2 focus:ring-offset-blue-1000 transition-shadow"
    {...props}
  >
    <Avatar className="h-full w-full">
      <AvatarImage src={imageUrl} alt="User avatar" />
    </Avatar>
  </button>
));
UserAvatarButton.displayName = "UserAvatarButton";

const SideNav = ({ theme, username }: { theme: Theme; username?: string }) => {
  const renderUserAvatar = () => {
    const userProfilePageUrl = `${END_POINTS.USERS}/${username}`;
    return (
      <Link to={userProfilePageUrl}>
        <UserAvatarButton imageUrl={userAvatarUrl} fallbackText="NR" />;
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-blue-1000 dark:bg-blue-2000">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <SvgLogo />
          <span className="font-bold text-2xl text-white-1000">Invoicely</span>
        </Link>
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
                          Simplify your invoicing process with our powerful
                          tools.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/features/create" title="Create Invoices">
                    Easily create professional invoices in minutes.
                  </ListItem>
                  <ListItem href="/features/track" title="Track Payments">
                    Keep track of all your payments in one place.
                  </ListItem>
                  <ListItem href="/features/reports" title="Generate Reports">
                    Get insights with detailed financial reports.
                  </ListItem>
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
                      description:
                        "Perfect for small businesses and freelancers.",
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
                    <ListItem
                      key={plan.title}
                      title={plan.title}
                      href={plan.href}
                    >
                      {plan.description}
                    </ListItem>
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
        </NavigationMenu>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher userPreference={theme} />
          {renderUserAvatar()}
        </div>
      </div>
    </header>
  );
};

export default SideNav;
