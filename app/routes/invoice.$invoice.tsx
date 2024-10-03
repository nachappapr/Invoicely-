import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { motion } from "framer-motion";
import LayoutContainer from "~/components/layout/LayoutContainer";
import InvoiceDetailsContainer from "~/components/features/invoicing/InvoiceDetailsContainer";
import NoInvoice from "~/components/features/invoicing/NoInvoice";
import { END_POINTS, ERROR_DESCRIPTIONS, ERROR_MESSAGES } from "~/constants";
import { requireUser } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";
import { redirectWithToast } from "~/utils/toast.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const invoiceId = params.invoice;
  const user = await requireUser(request);
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });

  invariantResponse(invoice, ERROR_MESSAGES.INVOICE_NOT_FOUND, { status: 404 });

  invariantResponse(
    invoice?.userId === user.id,
    ERROR_MESSAGES.NOT_AUTHORIZED,
    {
      status: 403,
    }
  );

  return json({ invoice }, { status: 200 });
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const invoiceId = params.invoice;
  const formData = await request.formData();
  const intent = formData.get("intent");
  const user = await requireUser(request);
  const selectedInvoice = await prisma.invoice.findFirst({
    select: { user: { select: { id: true, username: true } } },
    where: {
      id: invoiceId,
    },
  });

  invariantResponse(selectedInvoice, ERROR_MESSAGES.INVOICE_NOT_FOUND, {
    status: 404,
  });

  invariantResponse(
    user.id === selectedInvoice?.user.id,
    ERROR_MESSAGES.NOT_AUTHORIZED,
    { status: 403 }
  );

  if (intent) {
    if (intent === "delete") {
      await prisma.invoice.delete({
        where: {
          id: invoiceId,
        },
      });
      throw await redirectWithToast(END_POINTS.HOME, {
        title: ERROR_MESSAGES.INVOICE_DELETED,
        description: ERROR_DESCRIPTIONS[ERROR_MESSAGES.INVOICE_DELETED],
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
      return redirect(`${END_POINTS.INVOICE}/${invoiceId}`);
    }

    return redirect(END_POINTS.HOME);
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
      <InvoiceDetailsContainer />

      <Outlet />
    </motion.div>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  let errorTitle: string;

  if (isRouteErrorResponse(error)) {
    errorTitle = error.data ? error.data : ERROR_MESSAGES.SOMETHING_WENT_WRONG;
  } else {
    errorTitle = "Opps! Something went wrong";
  }

  return (
    <LayoutContainer>
      <NoInvoice
        title={errorTitle}
        description={
          ERROR_DESCRIPTIONS[errorTitle] ??
          ERROR_DESCRIPTIONS[ERROR_MESSAGES.SOMETHING_WENT_WRONG]
        }
      />
    </LayoutContainer>
  );
}

export default InvoiceDetailPage;
