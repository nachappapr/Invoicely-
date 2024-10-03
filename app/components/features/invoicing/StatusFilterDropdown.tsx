import { useSearchParams } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { STATUS_TYPES } from "~/constants";
import useOutsideClick from "~/hooks/useOutsideClick";
import StatusCheckbox from "./StatusCheckbox";
import { Button } from "~/components/ui/button";

/**
 *  start of animation variants
 */
const cardVariant = {
  initial: { opacity: 0, y: "-10vw" },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
  exit: {
    opacity: 0,
    y: "-10vw",
  },
};

const svgVariant = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
};

/** end of animation variants */

const StatusFilterDropdown = () => {
  const [toggleStatusMenu, setToggleStatusMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const ref = useRef(null);
  const [, setSearchParams] = useSearchParams();

  useOutsideClick({ ref, callback: handleClickOutside });

  function handleClickOutside(_event: MouseEvent) {
    setToggleStatusMenu(false);
  }

  const handleToggleStatusMenu = () =>
    setToggleStatusMenu((prevState) => !prevState);

  const handleSelectStatus = (status: string) => {
    setSelectedStatus((prevState) => {
      let newStatuses;
      if (prevState.includes(status)) {
        newStatuses = prevState.filter((item) => item !== status);
      } else {
        newStatuses = [...prevState, status];
      }

      const params = new URLSearchParams();
      newStatuses.forEach((status) => {
        params.append("status", status);
      });

      setSearchParams(params, {
        preventScrollReset: true,
      });

      return newStatuses;
    });
  };

  const renderCheckbox = () => {
    return STATUS_TYPES.map((status) => {
      return (
        <StatusCheckbox
          key={status}
          label={status}
          checked={selectedStatus.includes(status)}
          handleSelectStatus={handleSelectStatus}
        />
      );
    });
  };

  const renderStatusMenu = () => {
    return (
      <AnimatePresence>
        {toggleStatusMenu && (
          <motion.div
            variants={cardVariant}
            initial="initial"
            animate={toggleStatusMenu ? "animate" : "initial"}
            exit="exit"
            className="absolute top-10 left-[-25%] shadow-md rounded-lg"
          >
            <div className="max-w-[12rem] w-40 px-6 py-4 bg-white dark:bg-blue-1050 rounded-lg">
              <div className="flex flex-col gap-2">{renderCheckbox()}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        className="hover:!bg-transparent flex items-center gap-2"
        variant="ghost"
        onClick={handleToggleStatusMenu}
      >
        <h4 className="tertiary-heading-normal first-letter:capitalize">
          <span className="hidden md:block">filter by status</span>
          <span className="md:hidden">filter</span>
        </h4>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width={11}
          height={7}
          variants={svgVariant}
          initial="initial"
          animate={toggleStatusMenu ? "animate" : "initial"}
        >
          <path
            fill="none"
            stroke="#7C5DFA"
            strokeWidth={2}
            d="m1 1 4.228 4.228L9.456 1"
          />
        </motion.svg>
      </Button>
      {renderStatusMenu()}
    </div>
  );
};

export default StatusFilterDropdown;
