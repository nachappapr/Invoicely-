import { STATUS_COLOR } from "~/constants/invoices.contants";

const StatusCard = ({ status }: { status: "draft" | "pending" | "paid" }) => {
  return (
    <div
      className={`px-2 py-2 flex justify-around items-center ${STATUS_COLOR["paid"].bg} bg-opacity-5 rounded-md min-w-[100px] max-w-[100px] capitalize`}
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
