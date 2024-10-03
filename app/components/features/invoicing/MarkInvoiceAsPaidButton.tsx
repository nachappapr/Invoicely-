import { useFetcher } from "@remix-run/react";
import AnimatedLoader from "../../common/AnimatedLoader";
import { Button } from "../../ui/button";

const MarkInvoiceAsPaidButton = () => {
  const fetcher = useFetcher();
  const isPending = fetcher.state === "submitting";
  return (
    <fetcher.Form method="post" className="flex gap-2">
      <Button
        variant="invoice-primary"
        size="invoice-default"
        name="intent"
        value="paid"
        disabled={isPending}
      >
        {isPending ? <AnimatedLoader /> : "Mark as Paid"}
      </Button>
    </fetcher.Form>
  );
};

export default MarkInvoiceAsPaidButton;
