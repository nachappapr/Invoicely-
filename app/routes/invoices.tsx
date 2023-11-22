import type { MetaFunction } from "@remix-run/node";
import { IconPlus } from "~/assets/icons";
import FilterStatus from "~/components/FilterStatus";

export const meta: MetaFunction = () => {
  return [
    { title: "Invoice App" },
    {
      name: "description",
      content:
        "Streamline your invoicing process with our powerful invoice management application. Easily create, organize, and track invoices, manage clients, and ensure timely payments. Simplify your financial workflow and stay on top of your business finances with our intuitive and efficient invoicing solution.",
    },
  ];
};

const Invoices = () => {
  return (
    <div className="max-w-[70rem] mx-auto w-[95%] mt-8 md:mt-14 lg:w-full lg:mt-20">
      <div className="flex justify-between items-center">
        <h1 className="primary-heading">Invoices</h1>
        <div className="flex items-center gap-10">
          <FilterStatus />
          <button className="flex items-center justify-between gap-1  bg-purple-1000 pl-2 pr-4 h-12 rounded-3xl lg:gap-2 hover:bg-purple-1050 generic-transition">
            <div className="h-8 w-8 bg-white flex items-center justify-center rounded-full">
              <IconPlus />
            </div>
            <div className="tertiary-heading-normal capitalize !text-white">
              <span>new </span>
              <span className="hidden lg:inline-block">invoice</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
