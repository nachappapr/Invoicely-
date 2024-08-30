import { motion } from "framer-motion";

const backdropVariant = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 0.5,
    transition: {
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
    },
  },
};

const Backdrop = () => {
  return (
    <motion.div
      variants={backdropVariant}
      initial="initial"
      animate="final"
      exit="exit"
      className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-50 z-30"
    ></motion.div>
  );
};

export default Backdrop;
