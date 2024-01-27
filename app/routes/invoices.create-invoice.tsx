import {
  conform,
  list,
  requestIntent,
  useFieldList,
  useForm,
} from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { formatISO } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import SvgIconDelete from "~/assets/icons/IconDelete";
import SvgIconPlus from "~/assets/icons/IconPlus";
import Calender from "~/components/form/Calender";
import FormError from "~/components/form/FormError";
import ItemFieldSet from "~/components/form/ItemFieldSet";
import StyledInput from "~/components/form/StyledInput";
import StyledSelect from "~/components/form/StyledSelect";
import Backdrop from "~/components/ui/Backdrop";
import { InvoiceSchema } from "~/utils/schema";

const formLayoutVaraint = {
  initial: { opacity: 0, x: -100 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.1,
    },
  },
};

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema: InvoiceSchema,
  });

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
  }

  // need to update the form
  return null;
}

const CreateInvoiceRoute = () => {
  const actionData = useActionData<typeof action>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<boolean | null>(null);

  const [form, fields] = useForm({
    id: "invoice-form",
    constraint: getFieldsetConstraint(InvoiceSchema),
    lastSubmission: actionData?.submission,
    onValidate({ formData }) {
      return parse(formData, {
        schema: InvoiceSchema,
      });
    },
    defaultValue: {
      eventDate: formatISO(new Date(), { representation: "date" }),
      payment: "Net 1 Day",
    },
  });
  const invoiceItemList = useFieldList(form.ref, fields.itemList);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("..");
  };

  useEffect(() => {
    if (!ref.current) {
      requestIntent(form.ref.current, list.insert(fields.itemList.name));
    }
    ref.current = true;
  }, [fields.itemList.name, form.ref]);

  return (
    <div>
      <Backdrop />
      <motion.div
        variants={formLayoutVaraint}
        initial="initial"
        animate="animate"
        className="fixed top-0 bottom-0 left-0 z-40 w-full md:w-[90%] lg:w-[40rem] lg:left-16 px-16 py-14  bg-white dark:bg-blue-2000 md:rounded-3xl lg:md:rounded-3xl overflow-y-auto"
      >
        <Form className="flex flex-col gap-6" method="post" {...form.props}>
          <fieldset>
            <legend className="text-body-one !font-bold !text-purple-1000 mb-6">
              Bill From
            </legend>
            <div className="flex flex-col gap-4">
              <StyledInput
                htmlFor={fields.address.id}
                label="Address"
                errorId={fields.address.errorId}
                error={fields.address.error}
                {...conform.input(fields.address)}
                autoFocus
                showErrorMessages={true}
              />
              <div className="flex flex-row gap-4">
                <StyledInput
                  htmlFor={fields.city.id}
                  label="City"
                  errorId={fields.city.errorId}
                  error={fields.city.error}
                  {...conform.input(fields.city)}
                />
                <StyledInput
                  htmlFor={fields.postalCode.id}
                  label="Post Code"
                  errorId={fields.postalCode.errorId}
                  error={fields.postalCode.error}
                  {...conform.input(fields.postalCode)}
                />
                <StyledInput
                  htmlFor={fields.country.id}
                  label="Country"
                  errorId={fields.country.errorId}
                  error={fields.country.error}
                  {...conform.input(fields.country)}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-body-one !font-bold !text-purple-1000 mb-6">
              Bill To
            </legend>
            <div className="flex flex-col gap-4">
              <StyledInput
                htmlFor={fields.clientName.id}
                label="Client’s Name"
                errorId={fields.clientName.errorId}
                error={fields.clientName.error}
                {...conform.input(fields.clientName)}
                showErrorMessages={true}
              />
              <StyledInput
                htmlFor={fields.clientEmail.id}
                label="Client’s Email"
                errorId={fields.clientEmail.errorId}
                error={fields.clientEmail.error}
                {...conform.input(fields.clientEmail)}
                showErrorMessages={true}
              />
              <StyledInput
                htmlFor={fields.clientAddress.id}
                label="Street Address"
                errorId={fields.clientAddress.errorId}
                error={fields.clientAddress.error}
                {...conform.input(fields.clientAddress)}
                showErrorMessages={true}
              />
              <div className="flex flex-row gap-4">
                <StyledInput
                  htmlFor={fields.clientCity.id}
                  label="City"
                  errorId={fields.clientCity.errorId}
                  error={fields.clientCity.error}
                  {...conform.input(fields.clientCity)}
                />
                <StyledInput
                  htmlFor={fields.clientPostCode.id}
                  label="Post Code"
                  errorId={fields.clientPostCode.errorId}
                  error={fields.clientPostCode.error}
                  {...conform.input(fields.clientPostCode)}
                />
                <StyledInput
                  htmlFor={fields.clientCountry.id}
                  label="Country"
                  errorId={fields.clientCountry.errorId}
                  error={fields.clientCountry.error}
                  {...conform.input(fields.clientCountry)}
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <Calender
                    htmlFor={fields.eventDate.id}
                    label="Invoice Date"
                    errorId={fields.eventDate.errorId}
                    error={fields.eventDate.error}
                    field={fields.eventDate}
                  />
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <label
                      htmlFor={fields.payment.id}
                      className="text-body-two !text-indigo-1050 dark:!indigo-1000 inline-block"
                    >
                      Payment Terms
                    </label>
                    <div className="error-text" id={fields.payment.errorId}>
                      {fields.payment.error}
                    </div>
                  </div>
                  <StyledSelect
                    options={["Net 1 Day", "Net 7 Days"]}
                    field={fields.payment}
                  />
                </div>
              </div>
              <div>
                <StyledInput
                  htmlFor={fields.description.id}
                  label="Project Description"
                  errorId={fields.description.errorId}
                  error={fields.description.error}
                  {...conform.input(fields.description)}
                  showErrorMessages={true}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-[1.125rem] font-bold text-gray-2000 mb-4 capitalize">
              item list
            </legend>
            <div>
              {invoiceItemList.map((item, index) => {
                return (
                  <div
                    key={item.key}
                    className="grid grid-cols-[5fr_.5fr] gap-2 mb-4"
                  >
                    <ItemFieldSet key={item.key} config={item} />
                    <button
                      {...list.remove(fields.itemList.name, { index })}
                      className="self-end mb-5"
                    >
                      <SvgIconDelete />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              ref={buttonRef}
              className="flex flex-row justify-center items-center gap-1 w-full capitalize rounded-full mt-5 bg-ghost-white dark:!bg-blue-1050 tertiary-heading-normal !text-indigo-1050 p-4 hover:bg-indigo-1000 hover:dark:!bg-blue-1000 generic-transition"
              {...list.insert(fields.itemList.name)}
            >
              <SvgIconPlus fill="#7E88C3" />
              <span>add new item</span>
            </button>
          </fieldset>
          <FormError
            formError={false}
            invoiceItemError={fields.itemList.error}
          />
          <div className="flex justify-end gap-2 ">
            <button
              className="discardButton"
              type="button"
              onClick={handleClick}
            >
              cancel
            </button>
            <button className="saveButton" type="submit">
              save changes
            </button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default CreateInvoiceRoute;
