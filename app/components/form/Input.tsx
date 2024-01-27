import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className="w-full border-[1px] border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000 px-5 py-4 rounded-sm outline-indigo-1000 outline-0 focus:border-purple-1050 focus:dark:border-purple-1000 tertiary-heading-normal generic-transition"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
export default Input;
