import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { cn } from "../../lib/utils";
import {
  type FieldMetadata,
  unstable_useControl as useControl,
} from "@conform-to/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import clsx from "clsx";

export function DatePickerConform({
  meta,
  label,
}: {
  meta: FieldMetadata<Date>;
  label: string;
}) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const control = useControl(meta);

  return (
    <div>
      <input
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        ref={control.register}
        name={meta.name}
        defaultValue={
          meta.initialValue ? new Date(meta.initialValue).toISOString() : ""
        }
        onFocus={() => {
          triggerRef.current?.focus();
        }}
      />
      <Popover>
        <div className="flex justify-between items-start mb-2">
          <label
            htmlFor={meta.id}
            className={clsx(
              `text-body-two !text-indigo-1050 dark:!indigo-1000 inline-block capitalize`,
              {
                "!text-red-1000 dark:!text-red-1000": meta.errors,
              }
            )}
          >
            {label}
          </label>
        </div>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant={"outline"}
            className={cn(
              "w-64 justify-start text-left text-black-1000 focus:ring-1 focus:ring-purple-1000 focus:ring-offset-0 border-indigo-1000 dark:border-blue-1050 dark:bg-blue-1000 dark:text-white-1000 text-[0.75rem] font-bold rounded-sm hover:bg-none",
              !control.value && "text-muted-foreground "
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {control.value ? (
              format(control.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 dark:bg-blue-1000">
          <Calendar
            mode="single"
            selected={new Date(control.value ?? "")}
            onSelect={(value) => control.change(value?.toISOString() ?? "")}
            className="px-5 py-4"
            id="calendar"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
