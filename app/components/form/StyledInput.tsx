import clsx from "clsx";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  htmlFor?: string;
  label: string;
  errorId?: string;
  error?: string;
  showErrorMessages?: boolean;
};

const StyledInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { htmlFor, label, errorId, error, showErrorMessages, ...otherProps },
    ref
  ) => {
    return (
      <div>
        <div className="flex justify-between items-start mb-2">
          <label
            htmlFor={htmlFor}
            className={clsx(
              `text-body-two !text-indigo-1050 dark:!indigo-1000 inline-block`,
              {
                "!text-red-1000 dark:!text-red-1000": error,
              }
            )}
          >
            {label}
          </label>
          {showErrorMessages && (
            <div
              className="error-text first-letter:capitalize hidden md:block"
              id={errorId}
            >
              {error}
            </div>
          )}
        </div>
        <input
          ref={ref}
          className={clsx(
            `w-full border-[1px] border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000 px-5 py-4 rounded-sm outline-indigo-1000 outline-0 focus:border-purple-1050 focus:dark:border-purple-1000 tertiary-heading-normal generic-transition `,
            {
              "border-red-1000 dark:border-red-1000": error,
            }
          )}
          {...otherProps}
        />
      </div>
    );
  }
);

StyledInput.displayName = "StyledInput";

export default StyledInput;
