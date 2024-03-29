import { Form } from "@remix-run/react";
import { motion } from "framer-motion";
import React, { Fragment } from "react";
import useIsFormSubmitting from "~/hooks/useIsFormSubmitting";
import AnimatedLoader from "../ui/AnimatedLoader";
import Backdrop from "../ui/Backdrop";
import Card from "../ui/Card";

const backdropVariant = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const DeleteModal = ({
  children,
  onClose,
}: {
  children?: React.ReactNode;
  onClose: () => void;
}) => {
  const isPending = useIsFormSubmitting();

  return (
    <Fragment>
      <Backdrop />
      <motion.div
        variants={backdropVariant}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Card className="px-12 max-w-[30rem] w-[90%] absolute z-40 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h2 className="secondary-heading">Confirm Deletion</h2>
          <p className="text-body-two text-light mt-4 mb-4">{children}</p>
          <div className="flex items-center justify-end gap-2">
            <button
              className="button-edit tertiary-heading-normal !text-indigo-1050"
              onClick={onClose}
            >
              Cancel
            </button>
            <Form method="post">
              <button
                className="button-delete tertiary-heading-normal !text-ghost-white"
                name="intent"
                value="delete"
                disabled={isPending}
              >
                {isPending ? <AnimatedLoader /> : "Delete"}
              </button>
            </Form>
          </div>
        </Card>
      </motion.div>
    </Fragment>
  );
};

export default DeleteModal;
