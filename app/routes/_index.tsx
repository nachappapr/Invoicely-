import { Link } from "@remix-run/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { forwardRef, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { END_POINTS } from "~/constants";

const Avatar = ({ id }: { id: number }) => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="32" cy="32" r="32" fill="#F3D2C1" />
    <path
      d="M32 44C24.268 44 18 37.732 18 30C18 22.268 24.268 16 32 16C39.732 16 46 22.268 46 30C46 37.732 39.732 44 32 44Z"
      fill="#8D5524"
    />
    {id === 1 && (
      <>
        <path
          d="M24 28C25.1046 28 26 27.1046 26 26C26 24.8954 25.1046 24 24 24C22.8954 24 22 24.8954 22 26C22 27.1046 22.8954 28 24 28Z"
          fill="#FFF"
        />
        <path
          d="M40 28C41.1046 28 42 27.1046 42 26C42 24.8954 41.1046 24 40 24C38.8954 24 38 24.8954 38 26C38 27.1046 38.8954 28 40 28Z"
          fill="#FFF"
        />
        <path
          d="M32 38C29.2386 38 27 35.7614 27 33H37C37 35.7614 34.7614 38 32 38Z"
          fill="#FFF"
        />
      </>
    )}
    {id === 2 && (
      <>
        <path
          d="M24 29C25.6569 29 27 27.6569 27 26C27 24.3431 25.6569 23 24 23C22.3431 23 21 24.3431 21 26C21 27.6569 22.3431 29 24 29Z"
          fill="#FFF"
        />
        <path
          d="M40 29C41.6569 29 43 27.6569 43 26C43 24.3431 41.6569 23 40 23C38.3431 23 37 24.3431 37 26C37 27.6569 38.3431 29 40 29Z"
          fill="#FFF"
        />
        <path
          d="M32 40C28.134 40 25 36.866 25 33H39C39 36.866 35.866 40 32 40Z"
          fill="#FFF"
        />
      </>
    )}
    {id === 3 && (
      <>
        <path
          d="M24 30C26.2091 30 28 28.2091 28 26C28 23.7909 26.2091 22 24 22C21.7909 22 20 23.7909 20 26C20 28.2091 21.7909 30 24 30Z"
          fill="#FFF"
        />
        <path
          d="M40 30C42.2091 30 44 28.2091 44 26C44 23.7909 42.2091 22 40 22C37.7909 22 36 23.7909 36 26C36 28.2091 37.7909 30 40 30Z"
          fill="#FFF"
        />
        <path
          d="M32 42C27.5817 42 24 38.4183 24 34H40C40 38.4183 36.4183 42 32 42Z"
          fill="#FFF"
        />
      </>
    )}
    {id === 4 && (
      <>
        <path
          d="M24 28C25.1046 28 26 27.1046 26 26C26 24.8954 25.1046 24 24 24C22.8954 24 22 24.8954 22 26C22 27.1046 22.8954 28 24 28Z"
          fill="#FFF"
        />
        <path
          d="M40 28C41.1046 28 42 27.1046 42 26C42 24.8954 41.1046 24 40 24C38.8954 24 38 24.8954 38 26C38 27.1046 38.8954 28 40 28Z"
          fill="#FFF"
        />
        <path
          d="M32 39C28.6863 39 26 36.3137 26 33H38C38 36.3137 35.3137 39 32 39Z"
          fill="#FFF"
        />
      </>
    )}
    {id === 5 && (
      <>
        <path
          d="M24 29C25.6569 29 27 27.6569 27 26C27 24.3431 25.6569 23 24 23C22.3431 23 21 24.3431 21 26C21 27.6569 22.3431 29 24 29Z"
          fill="#FFF"
        />
        <path
          d="M40 29C41.6569 29 43 27.6569 43 26C43 24.3431 41.6569 23 40 23C38.3431 23 37 24.3431 37 26C37 27.6569 38.3431 29 40 29Z"
          fill="#FFF"
        />
        <path
          d="M32 41C27.0294 41 23 36.9706 23 32H41C41 36.9706 36.9706 41 32 41Z"
          fill="#FFF"
        />
      </>
    )}
    {id === 6 && (
      <>
        <path
          d="M24 30C26.2091 30 28 28.2091 28 26C28 23.7909 26.2091 22 24 22C21.7909 22 20 23.7909 20 26C20 28.2091 21.7909 30 24 30Z"
          fill="#FFF"
        />
        <path
          d="M40 30C42.2091 30 44 28.2091 44 26C44 23.7909 42.2091 22 40 22C37.7909 22 36 23.7909 36 26C36 28.2091 37.7909 30 40 30Z"
          fill="#FFF"
        />
        <path
          d="M32 43C26.4772 43 22 38.5228 22 33H42C42 38.5228 37.5228 43 32 43Z"
          fill="#FFF"
        />
      </>
    )}
  </svg>
);

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

export default function HomePage() {
  const [radius, setRadius] = useState(400);
  const userAvatars = [
    { src: "/placeholder.svg", alt: "User 1", bgColor: "bg-pink-200" },
    { src: "/placeholder.svg", alt: "User 2", bgColor: "bg-yellow-200" },
    { src: "/placeholder.svg", alt: "User 3", bgColor: "bg-blue-200" },
    { src: "/placeholder.svg", alt: "User 4", bgColor: "bg-green-200" },
    { src: "/placeholder.svg", alt: "User 5", bgColor: "bg-red-200" },
    { src: "/placeholder.svg", alt: "User 6", bgColor: "bg-gray-200" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const newRadius = window.innerWidth < 768 ? 200 : 400;
      setRadius(newRadius);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white-1000">
      <header className="sticky top-0 z-50 w-full border-b border-indigo-1000 dark:border-blue-1050 bg-white-1000/80 dark:bg-blue-2000/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-1000 dark:text-purple-1050"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            <span className="font-bold text-2xl text-purple-1000 dark:text-purple-1050">
              Invoicely
            </span>
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
                        description:
                          "Advanced features for growing businesses.",
                        href: "/pricing/pro",
                      },
                      {
                        title: "Enterprise Plan",
                        description:
                          "Custom solutions for large organizations.",
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
            <Link to={END_POINTS.LOGIN}>
              <Button
                variant="ghost"
                className="text-gray-1000 dark:text-white-1000 hover:text-purple-1000 dark:hover:text-purple-1050"
              >
                Log in
              </Button>
            </Link>
            <Link to={END_POINTS.SIGNUP}>
              <Button className="bg-purple-1000 text-white hover:bg-purple-1050 dark:bg-purple-1050 dark:hover:bg-purple-1000">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-white-1000 dark:bg-blue-2000 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center min-h-[600px] md:min-h-[800px]">
              <div className="relative w-full max-w-7xl mx-auto">
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ width: "100%", height: "100%" }}
                >
                  {userAvatars.map((avatar, index) => {
                    const angle = (index / userAvatars.length) * 2 * Math.PI;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={index}
                        className="absolute w-8 h-8 md:w-16 md:h-16"
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                        }}
                      >
                        <Avatar id={index} />
                      </motion.div>
                    );
                  })}
                </motion.div>
                <div
                  className="absolute border-4 border-purple-1000 dark:border-purple-1050 rounded-full"
                  style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full py-10 md:py-20 px-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-black-1000 dark:text-white-1000 mb-4">
                    Make fully customize
                    <br />
                    invoice in one tap
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-2000 dark:text-indigo-1000 text-sm md:text-xl mb-8">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint. Velit officia consequat duis enim velit
                    mollit. Exercitation.
                  </p>
                  <Button className="bg-purple-1000 text-white hover:bg-purple-1050 dark:bg-purple-1050 dark:hover:bg-purple-1000 rounded-full px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4 md:h-5 md:w-5"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    Get Started - It's Free
                  </Button>
                  <p className="text-xs md:text-sm text-gray-2000 dark:text-indigo-1000 mt-2">
                    ✨ No credit card required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
