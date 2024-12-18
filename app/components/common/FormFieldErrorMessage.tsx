import clsx from "clsx";

type ErrorMessageProps = {
  message?: string[];
  errorId?: string;
};

const FormFieldErrorMessage = ({ message, errorId }: ErrorMessageProps) => {
  return message?.map((msg, index) => (
    <div
      key={index}
      id={errorId}
      className={clsx(`error-text first-letter:capitalize `)}
    >
      {msg}
    </div>
  ));
};

export default FormFieldErrorMessage;
