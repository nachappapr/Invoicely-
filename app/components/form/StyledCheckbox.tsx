type StyledCheckboxProps = {
  label?: string;
  children: React.ReactNode;
  htmlFor?: string;
  privacyText?: string;
};

const CheckboxLabel = ({
  children,
  label,
  privacyText,
  htmlFor,
}: StyledCheckboxProps) => {
  return (
    <div className="items-top flex">
      {children}
      <div className="grid gap-1.5 leading-none ml-2">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-light"
        >
          {label}
        </label>
        {privacyText ? (
          <p className="text-sm text-light text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default CheckboxLabel;
