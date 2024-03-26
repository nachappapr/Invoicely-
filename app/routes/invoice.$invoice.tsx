import { json, type DataFunctionArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import InvoiceDetailsContainer from "~/components/containers/InvoiceDetailsContainer";
import NoInvoice from "~/components/invoice/NoInvoice";
import LayoutContainer from "~/components/ui/LayoutContainer";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";

export async function loader({ params }: DataFunctionArgs) {
  const invoiceId = params.invoice;
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });

  invariantResponse(invoice, "Invoice not found", { status: 404 });

  return json({ invoice }, { status: 200 });
}

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  console.log(formData.get("intent"), "intent");

  // need to update the form
  return null;
}

const InvoiceDetailPage = () => {
  return (
    <>
      <InvoiceDetailsContainer />;
      <Outlet />
    </>
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
    <LayoutContainer>
      <NoInvoice title={errorTitle} description="please check in sometime ✈️" />
    </LayoutContainer>
  );
}

export default InvoiceDetailPage;
