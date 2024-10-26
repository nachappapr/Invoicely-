import { forwardRef } from "react";
import clsx from "clsx";
import { NavigationMenuLink } from "~/components/ui/navigation-menu";
import { Link } from "@remix-run/react";

const NavigationListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={props.href ?? "#"}
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
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
NavigationListItem.displayName = "ListItem";

export default NavigationListItem;
