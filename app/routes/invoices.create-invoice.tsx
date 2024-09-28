import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { formatISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import SvgIconDelete from "~/assets/icons/IconDelete";
import SvgIconPlus from "~/assets/icons/IconPlus";
import AnimatedLoader from "~/components/common/AnimatedLoader";
import Backdrop from "~/components/common/Backdrop";
import { DatePickerConform } from "~/components/form/Calender";
import FormError from "~/components/form/FormError";
import StyledInput from "~/components/form/StyledInput";
import { SelectConform } from "~/components/form/StyledSelect";
import { Button } from "~/components/ui/button";
import { END_POINTS, PAYMENT_TERMS } from "~/constants";
import useIsFormSubmitting from "~/hooks/useIsFormSubmitting";
import { requireUserId } from "~/utils/auth.server";
import { validateCSRF } from "~/utils/csrf.server";
import { prisma } from "~/utils/db.server";
import { checkHoneypot } from "~/utils/honeypot.server";
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
  exit: {
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
      delay: 0.1,
    },
  },
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const userId = await requireUserId(request);

  await validateCSRF(formData, request.headers);
  const submission = parseWithZod(formData, {
    schema: InvoiceSchema,
  });

  checkHoneypot(formData);

  if (submission.status !== "success") {
    return json({ status: "error", submission: submission.reply() } as const, {
      status: 400,
    });
  }
  const { itemList, ...invoice } = submission.value;

  await prisma.invoice.create({
    data: {
      ...invoice,
      invoiceDate: new Date(invoice.invoiceDate),
      status: intent === "draft" ? "draft" : "pending",
      items: {
        create: itemList.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
      },
      userId,
    },
  });

  return redirect(END_POINTS.HOME);
}

const CreateInvoiceRoute = () => {
  const actionData = useActionData<typeof action>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isPending = useIsFormSubmitting();

  const [form, fields] = useForm({
    id: "invoice-form",
    constraint: getZodConstraint(InvoiceSchema),
    lastResult: navigation.state === "idle" ? actionData?.submission : null,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: InvoiceSchema,
      });
    },
    defaultValue: {
      invoiceDate: formatISO(new Date(), { representation: "date" }),
      paymentTerms: "1",
      itemList: [{ name: "", quantity: "", price: "" }],
    },
  });
  const invoiceItemList = fields.itemList.getFieldList();
  const paymentOptions = Object.entries(PAYMENT_TERMS).map(([name, value]) => ({
    name,
    value: value.toString(),
  }));
  const handleClick = () => {
    navigate("..");
  };

  return (
    <AnimatePresence mode="wait">
      <Backdrop />
      <motion.div
        variants={formLayoutVaraint}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed top-0 bottom-0 left-0 z-40 w-full md:w-[90%] lg:w-[40rem] lg:left-16 px-16 py-14  bg-white dark:bg-blue-2000 md:rounded-3xl lg:md:rounded-3xl overflow-y-auto"
        ref={divRef}
      >
        <Form
          className="flex flex-col gap-6 relative"
          method="post"
          id={form.id}
          onSubmit={form.onSubmit}
          noValidate
        >
          <h2 className="secondary-heading mt-12 mb-0 md:mb-6 md:mt-0 ">
            New Invoice
          </h2>
          <fieldset>
            <legend className="text-body-one !font-bold !text-purple-1000 mb-6">
              Bill From
            </legend>
            <div className="flex flex-col gap-4">
              <StyledInput
                htmlFor={fields.fromAddress.id}
                label="Address"
                errorId={fields.fromAddress.errorId}
                error={fields.fromAddress.errors}
                {...getInputProps(fields.fromAddress, { type: "text" })}
              />
              <div className="flex flex-row gap-4">
                <StyledInput
                  htmlFor={fields.fromCity.id}
                  label="City"
                  errorId={fields.fromCity.errorId}
                  error={fields.fromCity.errors}
                  {...getInputProps(fields.fromCity, { type: "text" })}
                  showErrorMessages={false}
                />
                <StyledInput
                  htmlFor={fields.fromPostalCode.id}
                  label="Post Code"
                  errorId={fields.fromPostalCode.errorId}
                  error={fields.fromPostalCode.errors}
                  {...getInputProps(fields.fromPostalCode, { type: "text" })}
                  showErrorMessages={false}
                />
                <StyledInput
                  htmlFor={fields.fromCountry.id}
                  label="Country"
                  errorId={fields.fromCountry.errorId}
                  error={fields.fromCountry.errors}
                  {...getInputProps(fields.fromCountry, { type: "text" })}
                  showErrorMessages={false}
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
                error={fields.clientName.errors}
                {...getInputProps(fields.clientName, { type: "text" })}
              />
              <StyledInput
                htmlFor={fields.clientEmail.id}
                label="Client’s Email"
                errorId={fields.clientEmail.errorId}
                error={fields.clientEmail.errors}
                {...getInputProps(fields.clientEmail, { type: "email" })}
              />
              <StyledInput
                htmlFor={fields.clientAddress.id}
                label="Street Address"
                errorId={fields.clientAddress.errorId}
                error={fields.clientAddress.errors}
                {...getInputProps(fields.clientAddress, {
                  type: "text",
                })}
              />
              <div className="flex flex-row gap-4">
                <StyledInput
                  htmlFor={fields.clientCity.id}
                  label="City"
                  errorId={fields.clientCity.errorId}
                  error={fields.clientCity.errors}
                  {...getInputProps(fields.clientCity, { type: "text" })}
                  showErrorMessages={false}
                />
                <StyledInput
                  htmlFor={fields.clientPostalCode.id}
                  label="Post Code"
                  errorId={fields.clientPostalCode.errorId}
                  error={fields.clientPostalCode.errors}
                  {...getInputProps(fields.clientPostalCode, {
                    type: "text",
                  })}
                  showErrorMessages={false}
                />
                <StyledInput
                  htmlFor={fields.clientCountry.id}
                  label="Country"
                  errorId={fields.clientCountry.errorId}
                  error={fields.clientCountry.errors}
                  {...getInputProps(fields.clientCountry, {
                    type: "text",
                  })}
                  showErrorMessages={false}
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <DatePickerConform
                    label={"invoice date"}
                    meta={fields.invoiceDate}
                  />
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <label
                      htmlFor={fields.paymentTerms.id}
                      className="text-body-two !text-indigo-1050 dark:!indigo-1000 inline-block"
                    >
                      Payment Terms
                    </label>
                    <div
                      className="error-text"
                      id={fields.paymentTerms.errorId}
                    >
                      {fields.paymentTerms.errors}
                    </div>
                  </div>
                  <SelectConform
                    items={paymentOptions}
                    meta={fields.paymentTerms}
                    placeholder="Select Payment Terms"
                  />
                </div>
              </div>
              <div>
                <StyledInput
                  htmlFor={fields.projectDescription.id}
                  label="Project Description"
                  errorId={fields.projectDescription.errorId}
                  error={fields.projectDescription.errors}
                  {...getInputProps(fields.projectDescription, {
                    type: "text",
                  })}
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
                const field = item.getFieldset();
                return (
                  <div
                    key={item.key}
                    className="grid grid-cols-[5fr_.5fr] gap-2 mb-4"
                  >
                    <fieldset className="grid grid-cols-[1fr_2fr] md:grid-cols-[2fr_1fr_1fr] grid-flow-row gap-4 items-center">
                      <div className="col-span-full lg:col-span-1">
                        <StyledInput
                          label="Item Name"
                          htmlFor={field.name.id}
                          errorId={field.name.errorId}
                          error={field.name.errors}
                          {...getInputProps(field.name, {
                            type: "text",
                          })}
                          showErrorMessages={false}
                        />
                      </div>
                      <div>
                        <StyledInput
                          label="Qty"
                          htmlFor={field.quantity.id}
                          errorId={field.quantity.errorId}
                          error={field.quantity.errors}
                          {...getInputProps(field.quantity, {
                            type: "number",
                            min: 1,
                            step: 1,
                          })}
                          showErrorMessages={false}
                        />
                      </div>
                      <div>
                        <StyledInput
                          label="Price"
                          htmlFor={field.price.id}
                          errorId={field.price.errorId}
                          error={field.price.errors}
                          {...getInputProps(field.price, {
                            type: "text",
                          })}
                          showErrorMessages={false}
                        />
                      </div>
                    </fieldset>
                    <button
                      {...form.remove.getButtonProps({
                        name: fields.itemList.name,
                        index,
                      })}
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
              type="button"
              {...form.insert.getButtonProps({ name: fields.itemList.name })}
            >
              <SvgIconPlus fill="#7E88C3" />
              <span>add new item</span>
            </button>
          </fieldset>
          <HoneypotInputs />
          <AuthenticityTokenInput />
          <FormError
            formError={false}
            invoiceItemError={fields.itemList.errors}
          />

          <div className="flex justify-between items-center">
            <Button
              variant="invoice-tertiary"
              size="invoice-default"
              type="button"
              onClick={handleClick}
            >
              Discard
            </Button>
            <div className="flex items-center justify-end gap-2 ">
              <Button
                variant="invoice-secondary"
                size="invoice-default"
                type="submit"
                disabled={isPending}
                name="intent"
                value="draft"
              >
                Save as Draft
              </Button>

              <Button
                variant="invoice-primary"
                size="invoice-default"
                className="saveButton"
                type="submit"
                disabled={isPending}
              >
                {isPending ? <AnimatedLoader /> : "Save Changes"}
              </Button>
            </div>
          </div>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateInvoiceRoute;
