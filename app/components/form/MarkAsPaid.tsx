import { useFetcher } from "@remix-run/react";
import AnimatedLoader from "../ui/AnimatedLoader";

const MarkAsPaid = () => {
  const fetcher = useFetcher();
  const isPending = fetcher.state === "submitting";
  return (
    <fetcher.Form method="post" className="flex gap-2">
      <button
        className="button-primary tertiary-heading-normal !text-ghost-white"
        name="intent"
        value="paid"
        disabled={isPending}
      >
        {isPending ? <AnimatedLoader /> : "Mark as Paid"}
      </button>
    </fetcher.Form>
  );
};

export default MarkAsPaid;
