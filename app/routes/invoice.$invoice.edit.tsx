import { getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { formatISO } from "date-fns";
import { motion } from "framer-motion";
import { useRef } from "react";
import SvgIconDelete from "~/assets/icons/IconDelete";
import SvgIconPlus from "~/assets/icons/IconPlus";
import AnimatedLoader from "~/components/common/AnimatedLoader";
import Backdrop from "~/components/common/Backdrop";
import { DatePickerConform } from "~/components/form/Calender";
import FormError from "~/components/form/FormError";
import StyledInput from "~/components/form/StyledInput";
import { SelectConform } from "~/components/form/StyledSelect";
import { PAYMENT_TERMS, STATUS_TYPES } from "~/constants/invoices.contants";
import useIsFormSubmitting from "~/hooks/useIsFormSubmitting";
import { prisma } from "~/utils/db.server";
import { invariantResponse } from "~/utils/misc";
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

export async function loader({ params }: LoaderFunctionArgs) {
  const invoiceId = params.invoice;
  invariantResponse(invoiceId, "Invoice not found", { status: 404 });
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    include: {
      items: true,
    },
  });
  return json({ invoice }, { status: 200 });
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const invoiceId = params.invoice;
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: InvoiceSchema,
  });

  if (submission.status !== "success") {
    return json({ status: "error", submission: submission.reply() } as const, {
      status: 400,
    });
  }

  const { itemList, ...invoice } = submission.value;

  await prisma.invoice.update({
    where: {
      id: invoiceId,
    },
    data: {
      ...invoice,
      invoiceDate: new Date(invoice.invoiceDate),
      items: {
        deleteMany: {},
        create: itemList.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })),
      },
    },
  });

  return redirect(`/invoice/${invoiceId}`);
}

const EditInvoice = () => {
  const actionData = useActionData<typeof action>();
  const { invoice } = useLoaderData<typeof loader>();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const params = useParams();
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
      ...invoice,
      invoiceDate: formatISO(new Date(invoice?.invoiceDate ?? ""), {
        representation: "date",
      }),
      itemList: invoice?.items,
    },
  });
  const invoiceItemList = fields.itemList.getFieldList();
  const paymentOptions = Object.entries(PAYMENT_TERMS).map(([name, value]) => ({
    name,
    value: value.toString(),
  }));
  const statusOptions = STATUS_TYPES.map((status) => ({
    name: status as string,
    value: status as string,
  }));

  const handleClick = () => {
    navigate("..");
  };

  return (
    <div>
      <Backdrop />
      <motion.div
        variants={formLayoutVaraint}
        initial="initial"
        animate="animate"
        className="fixed top-0 bottom-0 left-0 z-40 w-full md:w-[90%] lg:w-[40rem] lg:left-16 px-16 py-14  bg-white dark:bg-blue-2000 md:rounded-3xl lg:md:rounded-3xl overflow-y-auto"
        ref={divRef}
      >
        <Form
          className="flex flex-col gap-6"
          method="post"
          id={form.id}
          onSubmit={form.onSubmit}
          noValidate
        >
          <h2 className="secondary-heading mb-0 md:mb-6 ">
            Edit #{params.invoice}
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
                {...getInputProps(fields.fromAddress, {
                  type: "text",
                })}
                autoFocus
              />
              <div className="flex flex-row gap-4">
                <StyledInput
                  htmlFor={fields.fromCity.id}
                  label="City"
                  errorId={fields.fromCity.errorId}
                  error={fields.fromCity.errors}
                  {...getInputProps(fields.fromCity, {
                    type: "text",
                  })}
                />
                <StyledInput
                  htmlFor={fields.fromPostalCode.id}
                  label="Post Code"
                  errorId={fields.fromPostalCode.errorId}
                  error={fields.fromPostalCode.errors}
                  {...getInputProps(fields.fromPostalCode, {
                    type: "text",
                  })}
                />
                <StyledInput
                  htmlFor={fields.fromCountry.id}
                  label="Country"
                  errorId={fields.fromCountry.errorId}
                  error={fields.fromCountry.errors}
                  {...getInputProps(fields.fromCountry, {
                    type: "text",
                  })}
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
                {...getInputProps(fields.clientName, {
                  type: "text",
                })}
              />
              <StyledInput
                htmlFor={fields.clientEmail.id}
                label="Client’s Email"
                errorId={fields.clientEmail.errorId}
                error={fields.clientEmail.errors}
                {...getInputProps(fields.clientEmail, {
                  type: "email",
                })}
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
                  {...getInputProps(fields.clientCity, {
                    type: "text",
                  })}
                />
                <StyledInput
                  htmlFor={fields.clientPostalCode.id}
                  label="Post Code"
                  errorId={fields.clientPostalCode.errorId}
                  error={fields.clientPostalCode.errors}
                  {...getInputProps(fields.clientPostalCode, {
                    type: "text",
                  })}
                />
                <StyledInput
                  htmlFor={fields.clientCountry.id}
                  label="Country"
                  errorId={fields.clientCountry.errorId}
                  error={fields.clientCountry.errors}
                  {...getInputProps(fields.clientCountry, {
                    type: "text",
                  })}
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className="w-full">
                  <DatePickerConform
                    label="invoice date"
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
              <SelectConform
                placeholder="select status"
                items={statusOptions}
                meta={fields.status}
              />

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
                    {index !== 0 && (
                      <button
                        {...form.remove.getButtonProps({
                          name: fields.itemList.name,
                          index,
                        })}
                        className="self-end mb-5"
                      >
                        <SvgIconDelete />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              ref={buttonRef}
              className="flex flex-row justify-center items-center gap-1 w-full capitalize rounded-full mt-5 bg-ghost-white dark:!bg-blue-1050 tertiary-heading-normal !text-indigo-1050 p-4 hover:bg-indigo-1000 hover:dark:!bg-blue-1000 generic-transition"
              {...form.insert.getButtonProps({ name: fields.itemList.name })}
            >
              <SvgIconPlus fill="#7E88C3" />
              <span>add new item</span>
            </button>
          </fieldset>
          <FormError
            formError={false}
            invoiceItemError={fields.itemList.errors}
          />
          <div className="flex justify-end gap-2 ">
            <button
              className="discardButton"
              type="button"
              onClick={handleClick}
            >
              cancel
            </button>
            <button className="saveButton" type="submit" disabled={isPending}>
              {isPending ? <AnimatedLoader /> : "save changes"}
            </button>
          </div>
        </Form>
      </motion.div>
    </div>
  );
};

export default EditInvoice;
