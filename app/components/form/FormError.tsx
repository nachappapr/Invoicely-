const FormError = ({
  formError,
  invoiceItemError,
}: {
  formError: boolean | undefined;
  invoiceItemError: string | undefined;
}) => {
  if (!formError && !invoiceItemError) return null;

  return (
    <ul className="error-text">
      {formError && <li>- All fields must be added</li>}
      {invoiceItemError && <li>- {invoiceItemError}</li>}
    </ul>
  );
};

export default FormError;
