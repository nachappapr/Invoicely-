import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { motion } from "framer-motion";
import InvoiceDetailsContainer from "~/components/containers/InvoiceDetailsContainer";
import NoInvoice from "~/components/invoice/NoInvoice";
import LayoutContainer from "~/components/common/LayoutContainer";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";
import { redirectWithToast } from "~/utils/toast.server";

export async function loader({ params }: LoaderFunctionArgs) {
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

export async function action({ request, params }: LoaderFunctionArgs) {
  const invoiceId = params.invoice;
  const formData = await request.formData();
  const intent = formData.get("intent");

  invariantResponse(invoiceId, "Invoice not found", { status: 404 });

  if (intent) {
    if (intent === "delete") {
      await prisma.invoice.delete({
        where: {
          id: invoiceId,
        },
      });
      throw await redirectWithToast("/invoices", {
        title: "Invoice deleted",
        description: "Invoice has been deleted successfully",
        variant: "destructive",
      });
    }
    if (intent === "paid") {
      await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          status: "paid",
        },
      });
      return redirect(`/invoice/${invoiceId}`);
    }

    return redirect("/invoices");
  }

  return null;
}

const InvoiceDetailPage = () => {
  return (
    <motion.div
      initial="initialState"
      animate="animateState"
      exit="exitState"
      variants={{
        initialState: { opacity: 0 },
        animateState: { opacity: 1 },
        exitState: {},
      }}
    >
      <InvoiceDetailsContainer />;
      <Outlet />
    </motion.div>
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
