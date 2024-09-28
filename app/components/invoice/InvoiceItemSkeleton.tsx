import StatusCardSkeleton from "../StatusCardSkeleton";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

/**Variants start */
const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};
/**Variants end */

const InvoiceItemSkeleton = () => {
  return (
    <motion.li variants={item}>
      <Skeleton className="grid grid-cols-2 grid-rows-3 md:grid-rows-1 md:grid-cols-[.5fr_1fr_1fr_1fr_1fr_2rem] justify-items-center items-center bg-white rounded-lg py-6 px-4 shadow-md dark:bg-blue-1000 border-[1px] border-transparent">
        <Skeleton className="h-5 w-11"></Skeleton>
        <Skeleton className="w-24 h-5"></Skeleton>
        <Skeleton className="w-24 h-5 col-start-2  row-start-1 md:col-start-auto md:row-start-auto"></Skeleton>
        <Skeleton className="w-12 h-5 col-start-1 row-start-3 md:col-start-auto md:row-start-auto"></Skeleton>
        <div className="col-start-2 row-start-2 row-span-2 md:col-start-auto md:row-start-auto">
          <StatusCardSkeleton />
        </div>
        <Skeleton className="h-4 w-4 justify-self-end hidden md:block"></Skeleton>
      </Skeleton>
    </motion.li>
  );
};

export default InvoiceItemSkeleton;
