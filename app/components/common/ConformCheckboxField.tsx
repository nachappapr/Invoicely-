import {
  unstable_useControl as useControl,
  type FieldMetadata,
} from "@conform-to/react";
import { useRef, type ElementRef } from "react";
import { Checkbox } from "../ui/checkbox";

export function ConformCheckboxField({
  meta,
}: {
  meta: FieldMetadata<string | boolean | undefined>;
}) {
  const checkboxRef = useRef<ElementRef<typeof Checkbox>>(null);
  const control = useControl(meta);

  return (
    <>
      <input
        className="sr-only"
        aria-hidden
        ref={control.register}
        name={meta.name}
        tabIndex={-1}
        defaultValue={meta.initialValue}
        onFocus={() => checkboxRef.current?.focus()}
      />
      <Checkbox
        ref={checkboxRef}
        id={meta.id}
        checked={control.value === "on"}
        onCheckedChange={(checked) => {
          control.change(checked ? "on" : "");
        }}
        onBlur={control.blur}
        className="border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000 outline-indigo-1000 outline-0 focus:border-purple-1050 focus:dark:border-purple-1000"
      />
    </>
  );
}
