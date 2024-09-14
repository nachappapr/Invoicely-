type ErrorMessageProps = {
  message?: string[];
  errorId?: string;
};

const ErrorMessage = ({ message, errorId }: ErrorMessageProps) => {
  return message?.map((msg, index) => (
    <div
      key={index}
      id={errorId}
      className="error-text first-letter:capitalize hidden md:block"
    >
      {msg}
    </div>
  ));
};

export default ErrorMessage;
