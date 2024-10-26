import { Link } from "@remix-run/react";
import { Menu } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const MobileNavigationMenuItems = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-gray-1000 dark:text-white-1000"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] bg-white-1000 dark:bg-blue-2000"
      >
        <nav className="flex flex-col space-y-4 mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="features">
              <AccordionTrigger className="text-gray-1000 dark:text-white-1000 hover:text-purple-1000 dark:hover:text-purple-1050">
                Features
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-4">
                  <Link
                    to="/features/create"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Create Invoices
                  </Link>
                  <Link
                    to="/features/track"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Track Payments
                  </Link>
                  <Link
                    to="/features/reports"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Generate Reports
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="pricing">
              <AccordionTrigger className="text-gray-1000 dark:text-white-1000 hover:text-purple-1000 dark:hover:text-purple-1050">
                Pricing
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-4">
                  <Link
                    to="/pricing/free"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Free Plan
                  </Link>
                  <Link
                    to="/pricing/pro"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Pro Plan
                  </Link>
                  <Link
                    to="/pricing/enterprise"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Enterprise Plan
                  </Link>
                  <Link
                    to="/pricing/compare"
                    className="text-gray-800 dark:text-gray-200 hover:text-purple-1000 dark:hover:text-purple-1050"
                  >
                    Compare Plans
                  </Link>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            to="/about"
            className="text-gray-1000 dark:text-white-1000 hover:text-purple-1000 dark:hover:text-purple-1050 px-4"
          >
            About
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigationMenuItems;
