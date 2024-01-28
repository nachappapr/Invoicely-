import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import InvoiceDetailsContainer from "~/components/containers/InvoiceDetailsContainer";
import NoInvoice from "~/components/invoice/NoInvoice";
import LayoutContainer from "~/components/ui/LayoutContainer";

const InvoiceDetailPage = () => {
  return <InvoiceDetailsContainer />;
};

export function ErrorBoundary() {
  const error = useRouteError();
  let errorTitle: string;

  if (isRouteErrorResponse(error)) {
    errorTitle = error.status === 404 ? "Not Found" : "Something went wrong";
  } else {
    errorTitle = "Opps! Something went wrong";
  }

  return (
    <LayoutContainer>
      <NoInvoice title={errorTitle} description="please check in sometime ✈️" />
    </LayoutContainer>
  );
}

export default InvoiceDetailPage;
