import { Link } from "@remix-run/react";
import React from "react";
import { IconPlus } from "~/assets/icons";
import FilterStatus from "../FilterStatus";
import LayoutContainer from "../ui/LayoutContainer";

const InvoiceDashboardContainer = ({
  totalInvoice,
  children,
}: {
  totalInvoice: number;
  children: React.ReactNode;
}) => {
  return (
    <LayoutContainer>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="primary-heading ">Invoices</h1>
          <span className="hidden lg:inline-block text-body-two !text-indigo-2000 dark:!text-indigo-1000">
            {`There are ${totalInvoice} total invoices`}
          </span>
          <span className="lg:hidden text-body-two !text-indigo-2000 dark:!text-indigo-1000">
            7 invoices
          </span>
        </div>
        <div className="flex items-center gap-4 lg:gap-10">
          <FilterStatus />
          <Link to="./create-invoice">
            <button className="flex items-center justify-between gap-1  bg-purple-1000 pl-2 pr-4 h-12 rounded-3xl lg:gap-2 hover:bg-purple-1050 generic-transition">
              <div className="h-8 w-8 bg-white flex items-center justify-center rounded-full">
                <IconPlus />
              </div>
              <div className="tertiary-heading-normal capitalize !text-white">
                <span>new </span>
                <span className="hidden lg:inline-block">invoice</span>
              </div>
            </button>
          </Link>
        </div>
      </div>
      {children}
    </LayoutContainer>
  );
};

export default InvoiceDashboardContainer;
