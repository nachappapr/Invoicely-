import { motion } from "framer-motion";
import InvoiceItemSkeleton from "./InvoiceItemSkeleton";

/**Variants start */
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
/**Variants end */

const INVOICES_PLACEHOLDER = Array(5)
  .fill(5)
  .map<{ id: number }>((item, index) => ({
    id: index + 1,
  }));

const InvoiceItemsSkeleton = () => {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 mt-8 selection:md:mt-14 lg:mt-16 cursor-pointer"
    >
      {INVOICES_PLACEHOLDER.map((invoice) => {
        return <InvoiceItemSkeleton key={invoice.id} />;
      })}
    </motion.ul>
  );
};

export default InvoiceItemsSkeleton;
