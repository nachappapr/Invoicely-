import { conform, useInputEvent, type FieldConfig } from "@conform-to/react";
import { Fragment, useRef, useState } from "react";
import Select from "./Select";

interface SelectProps {
  options: Array<string>;
  field: FieldConfig<string>;
}

const StyledSelect = ({ options, field }: SelectProps) => {
  const [value, setValue] = useState(field.defaultValue ?? options[0]);

  const shadowInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLDivElement>(null);

  const control = useInputEvent({
    ref: shadowInputRef,
    onReset: () => setValue(field.defaultValue ?? options[0]),
  });

  return (
    <Fragment>
      <input
        ref={shadowInputRef}
        {...conform.input(field, {
          hidden: true,
        })}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <Select
        onChange={control.change}
        defaultValue={field.defaultValue}
        options={options}
        value={value}
        ref={customInputRef}
      />
    </Fragment>
  );
};

export default StyledSelect;
