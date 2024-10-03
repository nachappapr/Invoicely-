import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import InvoiceDashboardContainer from "~/components/features/invoicing/InvoiceDashboardContainer";
import InvoiceItems from "~/components/features/invoicing/InvoiceItems";
import InvoiceItemsSkeleton from "~/components/skeletons/InvoiceItemsSkeleton";
import NoInvoice from "~/components/features/invoicing/NoInvoice";
import { ERROR_DESCRIPTIONS, ERROR_MESSAGES } from "~/constants";
import useIsPageLoading from "~/hooks/useIsPageLoading";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const query = searchParams.getAll("status");
  const userId = await requireUserId(request);

  const result = await prisma.invoice.findMany({
    where: {
      userId,
      ...(query?.length > 0 ? { status: { in: query } } : {}),
    },
    select: {
      clientName: true,
      id: true,
      createdAt: true,
      status: true,
      items: {
        select: {
          total: true,
        },
      },
    },
  });

  invariantResponse(result, ERROR_MESSAGES.NO_INVOICES_FOUND, { status: 400 });

  const invoices = result.map((invoice) => {
    const total = invoice.items.reduce(
      (acc, item) => acc + (item?.total ?? 0),
      0
    );
    return {
      id: invoice.id,
      clientName: invoice.clientName,
      status: invoice.status as "draft" | "pending" | "paid",
      createdAt: new Date(invoice.createdAt).toLocaleDateString("en-US"),
      total,
    };
  });

  return json({ invoices }, { status: 200 });
};

const Invoices = () => {
  const { invoices } = useLoaderData<typeof loader>();
  const isLoading = useIsPageLoading();

  const renderInvoiceItem = () => {
    if (isLoading) return <InvoiceItemsSkeleton />;
    if (invoices?.length === 0) return <NoInvoice />;
    return <InvoiceItems invoices={invoices} />;
  };

  return (
    <InvoiceDashboardContainer
      totalInvoice={invoices?.length ?? 0}
      isLoading={isLoading}
    >
      {renderInvoiceItem()}
      <Outlet />
    </InvoiceDashboardContainer>
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
    <InvoiceDashboardContainer totalInvoice={0}>
      <NoInvoice
        title={errorTitle}
        description={
          ERROR_DESCRIPTIONS[errorTitle] ??
          ERROR_DESCRIPTIONS[ERROR_MESSAGES.SOMETHING_WENT_WRONG]
        }
      />
    </InvoiceDashboardContainer>
  );
}

export default Invoices;
