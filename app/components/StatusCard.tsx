import clsx from "clsx";
import { STATUS_COLOR } from "~/constants/invoices.contants";

const StatusCard = ({ status }: { status: "draft" | "pending" | "paid" }) => {
  return (
    <div
      className={clsx(
        `px-2 py-2 flex justify-around items-center bg-opacity-5 rounded-md min-w-[100px] max-w-[100px] capitalize`,
        {
          "bg-green-1000 bg-opacity-5 !text-green-1000": status === "paid",
          "bg-gray-1050 bg-opacity-5 !text-gray-1050 dark:!text-indigo-1000":
            status === "draft",
          "bg-orange-1000 bg-opacity-5 !text-orange-1000": status === "pending",
        }
      )}
    >
      <span
        className={`h-2 w-2 rounded-full ${STATUS_COLOR[status].bg}`}
      ></span>
      <span className={`tertiary-heading-normal ${STATUS_COLOR[status].text}`}>
        {status}
      </span>
    </div>
  );
};

export default StatusCard;
