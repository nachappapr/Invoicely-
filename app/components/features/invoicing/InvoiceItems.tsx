import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import { type InvoiceType } from "~/global";
import InvoiceItem from "./InvoiceItem";

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

type InvoiceItemsProps = { invoices: InvoiceType[] };

const InvoiceItems = ({ invoices }: InvoiceItemsProps) => {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 mt-8 selection:md:mt-14 lg:mt-16 cursor-pointer"
    >
      {invoices.map((invoice) => {
        return (
          <Link
            to={`/invoice/${invoice.id}`}
            key={invoice.id}
            prefetch="intent"
          >
            <InvoiceItem {...invoice} />
          </Link>
        );
      })}
    </motion.ul>
  );
};

export default InvoiceItems;
