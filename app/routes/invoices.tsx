import { json, type MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  Outlet,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import InvoiceDashboardContainer from "~/components/containers/InvoiceDashboardContainer";
import InvoiceItems from "~/components/invoice/InvoiceItems";
import NoInvoice from "~/components/invoice/NoInvoice";
import { INVOICE_LIST_ITEMS } from "~/db";

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

export const loader = () => {
  const invoices = INVOICE_LIST_ITEMS;
  return json({ invoices }, { status: 200 });
};

const Invoices = () => {
  const { invoices } = useLoaderData<typeof loader>();

  return (
    <InvoiceDashboardContainer>
      {invoices?.length === 0 && <NoInvoice />}
      <InvoiceItems invoices={invoices} />
      <Outlet />
    </InvoiceDashboardContainer>
  );
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
    <InvoiceDashboardContainer>
      <NoInvoice title={errorTitle} description="please check in sometime ✈️" />
    </InvoiceDashboardContainer>
  );
}

export default Invoices;
