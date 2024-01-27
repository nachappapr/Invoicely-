import { conform, useInputEvent, type FieldConfig } from "@conform-to/react";
import { formatISO } from "date-fns";
import { useRef, useState } from "react";
import StyledInput from "./StyledInput";

type CalenderProps = {
  htmlFor?: string;
  label: string;
  errorId?: string;
  error?: string;
  field: FieldConfig<string>;
};

const Calender = ({ htmlFor, label, error, errorId, field }: CalenderProps) => {
  const today = formatISO(new Date(), { representation: "date" });
  const [value, setValue] = useState(field.defaultValue ?? today);

  const baseInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const control = useInputEvent({
    ref: baseInputRef,
    onReset: () => setValue(field.defaultValue ?? ""),
  });

  return (
    <>
      <input
        ref={baseInputRef}
        {...conform.input(field, { hidden: true })}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => customInputRef.current?.focus()}
      />
      <StyledInput
        label={label}
        htmlFor={htmlFor}
        error={error}
        errorId={errorId}
        value={value}
        onChange={control.change}
        onBlur={control.blur}
        ref={customInputRef}
        type="date"
      />
    </>
  );
};

export default Calender;
