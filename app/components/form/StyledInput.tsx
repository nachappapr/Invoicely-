import clsx from "clsx";
import { forwardRef } from "react";
import ErrorMessage from "./ErrorMessage";
import { Input } from "../ui/input";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  htmlFor?: string;
  label: string;
  errorId?: string;
  error?: string[];
  showErrorMessages?: boolean;
};

const StyledInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { htmlFor, label, errorId, error, showErrorMessages = true, ...otherProps },
    ref
  ) => {
    const renderError = () => {
      if (!error?.length) return null;
      return <ErrorMessage message={error} errorId={errorId} />;
    };

    return (
      <div>
        <div className="flex justify-between items-start mb-2">
          <label
            htmlFor={htmlFor}
            className={clsx(
              `text-body-two !text-indigo-1050 dark:!indigo-1000 inline-block capitalize`,
              {
                "!text-red-1000 dark:!text-red-1000": error,
              }
            )}
          >
            {label}
          </label>
          {renderError()}
        </div>
        <Input
          ref={ref}
          className={clsx(
            `w-full border-[1px] border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000 px-5 py-4 rounded-[4px] outline-indigo-1000 outline-0 focus:border-purple-1050 focus:dark:border-purple-1000 tertiary-heading-normal generic-transition `,
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
