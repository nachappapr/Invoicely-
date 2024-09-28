import clsx from "clsx";
import { Skeleton } from "./ui/skeleton";

const StatusCardSkeleton = () => {
  return (
    <Skeleton
      className={clsx(
        `px-2 py-2 flex justify-around items-center bg-opacity-5 rounded-md min-w-[100px] max-w-[100px] capitalize`
      )}
    >
      <Skeleton className="h-2 w-2 rounded-full"></Skeleton>
      <Skeleton className="w-5 h-5"></Skeleton>
    </Skeleton>
  );
};

export default StatusCardSkeleton;
