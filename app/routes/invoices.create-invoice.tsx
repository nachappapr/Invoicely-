import {
  conform,
  list,
  requestIntent,
  useFieldList,
  useForm,
} from "@conform-to/react";
import { getFieldsetConstraint, parse } from "@conform-to/zod";
import { json, redirect, type DataFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { formatISO } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import SvgIconDelete from "~/assets/icons/IconDelete";
import SvgIconPlus from "~/assets/icons/IconPlus";
import Calender from "~/components/form/Calender";
import FormError from "~/components/form/FormError";
import ItemFieldSet from "~/components/form/ItemFieldSet";
import StyledInput from "~/components/form/StyledInput";
import StyledSelect from "~/components/form/StyledSelect";
import AnimatedLoader from "~/components/ui/AnimatedLoader";
import Backdrop from "~/components/ui/Backdrop";
import { PAYMENT_TERMS } from "~/constants/invoices.contants";
import useIsFormSubmitting from "~/hooks/useIsFormSubmitting";
import useOutsideClick from "~/hooks/useOutsideClick";
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

export async function action({ request }: DataFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  await validateCSRF(formData, request.headers);
  const submission = parse(formData, {
    schema: InvoiceSchema,
  });

  checkHoneypot(formData);

  if (!submission.value) {
    return json({ status: "error", submission } as const, { status: 400 });
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
      userId: "clu7zzd150000f0a1uu8mp1rr",
    },
  });

  return redirect("/invoices");
}

const CreateInvoiceRoute = () => {
  const actionData = useActionData<typeof action>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<boolean | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const isPending = useIsFormSubmitting();

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
      invoiceDate: formatISO(new Date(), { representation: "date" }),
      paymentTerms: "Net 1 Day",
    },
  });
  const invoiceItemList = useFieldList(form.ref, fields.itemList);
  const navigate = useNavigate();

  useOutsideClick({
    ref: divRef,
    callback: (event) => {
      const sideNav = document.getElementById("side-nav");
      if (event.target instanceof Node) {
        if (sideNav && !sideNav.contains(event.target)) {
          navigate("..");
        }
      }
    },
  });

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
          {...form.props}
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
                error={fields.fromAddress.error}
                {...conform.input(fields.fromAddress)}
                autoFocus
                showErrorMessages={true}
              />
              <div className="flex flex-row gap-4">
                <StyledInput
                  htmlFor={fields.fromCity.id}
                  label="City"
                  errorId={fields.fromCity.errorId}
                  error={fields.fromCity.error}
                  {...conform.input(fields.fromCity)}
                />
                <StyledInput
                  htmlFor={fields.fromPostalCode.id}
                  label="Post Code"
                  errorId={fields.fromPostalCode.errorId}
                  error={fields.fromPostalCode.error}
                  {...conform.input(fields.fromPostalCode)}
                />
                <StyledInput
                  htmlFor={fields.fromCountry.id}
                  label="Country"
                  errorId={fields.fromCountry.errorId}
                  error={fields.fromCountry.error}
                  {...conform.input(fields.fromCountry)}
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
                  htmlFor={fields.clientPostalCode.id}
                  label="Post Code"
                  errorId={fields.clientPostalCode.errorId}
                  error={fields.clientPostalCode.error}
                  {...conform.input(fields.clientPostalCode)}
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
                    htmlFor={fields.invoiceDate.id}
                    label="Invoice Date"
                    errorId={fields.invoiceDate.errorId}
                    error={fields.invoiceDate.error}
                    field={fields.invoiceDate}
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
                      {fields.paymentTerms.error}
                    </div>
                  </div>
                  <StyledSelect
                    options={Object.keys(PAYMENT_TERMS)}
                    field={fields.paymentTerms}
                  />
                </div>
              </div>
              <div>
                <StyledInput
                  htmlFor={fields.projectDescription.id}
                  label="Project Description"
                  errorId={fields.projectDescription.errorId}
                  error={fields.projectDescription.error}
                  {...conform.input(fields.projectDescription)}
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
          <HoneypotInputs />
          <AuthenticityTokenInput />
          <FormError
            formError={false}
            invoiceItemError={fields.itemList.error}
          />

          <div className="flex justify-between items-center">
            <button className="editButton" type="button" onClick={handleClick}>
              discard
            </button>
            <div className="flex items-center justify-end gap-2 ">
              <button
                className="discardButton"
                type="submit"
                disabled={isPending}
                name="intent"
                value="draft"
              >
                Save as Draft
              </button>

              <button className="saveButton" type="submit" disabled={isPending}>
                {isPending ? <AnimatedLoader /> : "save changes"}
              </button>
            </div>
          </div>
        </Form>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateInvoiceRoute;
