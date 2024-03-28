import { conform, useFieldset, type FieldConfig } from "@conform-to/react";
import { useRef } from "react";
import type { z } from "zod";
import type { itemSchema } from "~/utils/schema";
import StyledInput from "./StyledInput";

const ItemFieldSet = ({
  config,
}: {
  config: FieldConfig<z.infer<typeof itemSchema>>;
}) => {
  const htmlRef = useRef<HTMLFieldSetElement>(null);
  const { id, name, price, quantity } = useFieldset(htmlRef, config);

  return (
    <fieldset
      className="grid grid-cols-[1fr_2fr] md:grid-cols-[2fr_1fr_1fr] grid-flow-row gap-4 items-center"
      ref={htmlRef}
    >
      <div className="col-span-full lg:col-span-1">
        <input type="hidden" {...conform.input(id)} />
        <StyledInput
          label="Item Name"
          htmlFor={name.id}
          errorId={name.errorId}
          error={name.error}
          {...conform.input(name)}
          showErrorMessages={false}
        />
      </div>
      <div>
        <StyledInput
          label="Qty"
          htmlFor={quantity.id}
          errorId={quantity.errorId}
          error={quantity.error}
          {...conform.input(quantity)}
          showErrorMessages={false}
        />
      </div>
      <div>
        <StyledInput
          label="Price"
          htmlFor={price.id}
          errorId={price.errorId}
          error={price.error}
          {...conform.input(price)}
          showErrorMessages={false}
        />
      </div>
    </fieldset>
  );
};

export default ItemFieldSet;
