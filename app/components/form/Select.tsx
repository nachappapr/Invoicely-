import { AnimatePresence, motion } from "framer-motion";
import React, { useRef, useState, type KeyboardEvent } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type SelectProps = {
  options: string[];
  id?: string;
  value: string;
  onChange: (option: string) => void;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange">;

const SelectVariant = {
  initial: {
    opacity: 0,
    y: "-10px",
  },
  final: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    y: "-10px",
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

const svgVariant = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
};

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ options, id, value, onChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const animate = isOpen ? "animate" : "initial";
    const selectRef = useRef<HTMLDivElement | null>(null);

    useOutsideClick({ ref: selectRef, callback: onOutsideClick });

    function onOutsideClick() {
      setIsOpen(false);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        setIsOpen(!isOpen);
      }
    };

    return (
      <div
        className={`relative w-full rounded-md ${props.className}`}
        ref={selectRef}
      >
        <div
          ref={ref}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={id}
          aria-describedby={props["aria-describedby"]}
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`w-full border-[1px] border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000 px-5 py-4 rounded-sm outline-indigo-1000 outline-0 focus:border-purple-1050 focus:dark:border-purple-1000 tertiary-heading-normal generic-transition`}
        >
          {value}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={SelectVariant}
              initial="initial"
              animate="final"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              role="listbox"
              className="absolute top-full mt-4 w-full border bg-white dark:bg-blue-1000 dark:border-blue-1050 z-10 rounded-md"
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  role="option"
                  aria-selected={option === value}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`px-6 py-3 hover:text-purple-1000 cursor-pointer  border-b border-american-blue-100 dark:border-blue-1050 border-opacity-20 last:border-none body-one-text text-dark-blue-gray transition-colors ease-in-out duration-75`}
                >
                  <div className="flex justify-between items-center">
                    <div>{option}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute right-4 top-6">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width={11}
            height={7}
            variants={svgVariant}
            initial="initial"
            animate={animate}
          >
            <path
              fill="none"
              stroke="#7C5DFA"
              strokeWidth={2}
              d="m1 1 4.228 4.228L9.456 1"
            />
          </motion.svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "CustomDropdown";

export default Select;
