import { Link } from "@remix-run/react";
import { forwardRef, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import clsx from "clsx";

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
      <header className="sticky top-0 z-50 w-full border-b border-indigo-1000 bg-white-1000/80 backdrop-blur-sm">
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
              className="text-purple-1000"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            <span className="font-bold text-2xl text-purple-1000">
              Invoicely
            </span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-1000 hover:text-purple-1000">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/features/create"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-1000 hover:text-purple-1000 focus:bg-indigo-1000 focus:text-purple-1000"
                        >
                          <div className="text-sm font-medium leading-none">
                            Create Invoices
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-2000">
                            Easily create professional invoices in minutes.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/features/track"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-1000 hover:text-purple-1000 focus:bg-indigo-1000 focus:text-purple-1000"
                        >
                          <div className="text-sm font-medium leading-none">
                            Track Payments
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-2000">
                            Keep track of all your payments in one place.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          href="/features/reports"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-1000 hover:text-purple-1000 focus:bg-indigo-1000 focus:text-purple-1000"
                        >
                          <div className="text-sm font-medium leading-none">
                            Generate Reports
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-2000">
                            Get insights with detailed financial reports.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-1000 hover:text-purple-1000">
                  Pricing
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                      <li key={plan.title}>
                        <NavigationMenuLink asChild>
                          <a
                            href={plan.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-indigo-1000 hover:text-purple-1000 focus:bg-indigo-1000 focus:text-purple-1000"
                          >
                            <div className="text-sm font-medium leading-none">
                              {plan.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-2000">
                              {plan.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
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
            <Button
              variant="ghost"
              className="text-gray-1000 hover:text-purple-1000"
            >
              Log in
            </Button>
            <Button className="bg-purple-1000 text-white hover:bg-purple-1050">
              Sign up
            </Button>
          </div>
        </div>
      </header>
      <main>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48  overflow-hidden">
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
                        className={`absolute w-8 h-8 md:w-16 md:h-16 rounded-full ${avatar.bgColor} overflow-hidden`}
                        style={{
                          top: "50%",
                          left: "50%",
                          transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
                        }}
                      >
                        <image
                          src={avatar.src}
                          alt={avatar.alt}
                          width={64}
                          height={64}
                          className="rounded-full w-full h-full object-cover"
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
                <div
                  className="absolute border-4 border-purple-1000 rounded-full"
                  style={{
                    width: `${radius * 2}px`,
                    height: `${radius * 2}px`,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full py-10 md:py-20 px-4">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tighter sm:text-5xl lg:text-7xl text-black-1000 mb-4">
                    Make fully customize
                    <br />
                    invoice in one tap
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-2000 text-sm md:text-xl mb-8">
                    Amet minim mollit non deserunt ullamco est sit aliqua dolor
                    do amet sint. Velit officia consequat duis enim velit
                    mollit. Exercitation.
                  </p>
                  <Button className="bg-purple-1000 text-white hover:bg-purple-1050 rounded-full px-6 py-2 md:px-8 md:py-3 text-sm md:text-lg">
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
                  <p className="text-xs md:text-sm text-gray-2000 mt-2">
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
