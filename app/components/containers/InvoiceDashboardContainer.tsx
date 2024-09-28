import { Link } from "@remix-run/react";
import React, { Fragment } from "react";
import { IconPlus } from "~/assets/icons";
import FilterStatus from "../FilterStatus";
import LayoutContainer from "../common/LayoutContainer";
import { Button } from "../ui/button";
import InvoiceTotalSkeleton from "../skeletons/InvoiceTotalSkeleton";

const InvoiceDashboardContainer = ({
  totalInvoice,
  children,
  isLoading,
}: {
  totalInvoice: number;
  children: React.ReactNode;
  isLoading?: boolean;
}) => {
  const renderInvoiceCount = () => {
    if (isLoading) return <InvoiceTotalSkeleton />;
    return (
      <Fragment>
        <span className="hidden lg:inline-block text-body-two !text-indigo-2000 dark:!text-indigo-1000">
          {`There are ${totalInvoice} total invoices`}
        </span>
        <span className="lg:hidden text-body-two !text-indigo-2000 dark:!text-indigo-1000">
          {`${totalInvoice} invoices`}
        </span>
      </Fragment>
    );
  };

  return (
    <LayoutContainer>
      <div className="w-90% md:w-full flex justify-between items-center">
        <div>
          <h1 className="primary-heading">Invoices</h1>
          {renderInvoiceCount()}
        </div>
        <div className="flex items-center gap-4 lg:gap-10">
          <FilterStatus />
          <Link to="./create-invoice">
            <Button
              variant="invoice-primary"
              size="invoice-default"
              className="gap-1 pl-2 pr-4 h-12 lg:gap-2"
            >
              <div className="h-8 w-8 bg-white flex items-center justify-center rounded-full">
                <IconPlus />
              </div>
              <div className="tertiary-heading-normal capitalize !text-white">
                <span>new </span>
                <span className="hidden lg:inline-block">invoice</span>
              </div>
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </LayoutContainer>
  );
};

export default InvoiceDashboardContainer;
