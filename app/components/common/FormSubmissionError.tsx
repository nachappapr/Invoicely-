const FormSubmissionError = ({
  formError,
  invoiceItemError,
}: {
  formError?: boolean;
  invoiceItemError?: string[];
}) => {
  if (!formError && !invoiceItemError) return null;

  return (
    <ul className="error-text">
      {formError && <li>- All fields must be added</li>}
      {invoiceItemError &&
        invoiceItemError.map((error) => <li key={error}>- {error}</li>)}
    </ul>
  );
};

export default FormSubmissionError;
