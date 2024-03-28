import { Form, Link, useLoaderData } from "@remix-run/react";
import { Fragment, useState } from "react";
import { IconArrowLeft } from "~/assets/icons";
import type {
  PAYMENT_TERMS,
  STATUS_TYPES,
} from "~/constants/invoices.contants";
import { type loader } from "~/routes/invoice.$invoice";
import {
  addDaysToPaymentDate,
  getFormattedDate,
  getTotals,
} from "~/utils/misc";
import StatusCard from "../StatusCard";
import DeleteModal from "../form/DeleteModal";
import MarkAsPaid from "../form/MarkAsPaid";
import Card from "../ui/Card";
import LayoutContainer from "../ui/LayoutContainer";

const InvoiceDetailsContainer = () => {
  const {
    invoice: {
      id,
      clientName,
      clientAddress,
      clientCity,
      clientCountry,
      clientPostalCode,
      clientEmail,
      status,
      projectDescription,
      fromAddress,
      fromCity,
      fromCountry,
      fromPostalCode,
      invoiceDate,
      paymentTerms,
      items,
    },
  } = useLoaderData<typeof loader>();
  const [toggleDeleteModal, setToggleDeleteModal] = useState(false);

  const openDeleteModal = () => {
    setToggleDeleteModal(true);
  };

  const renderListItems = () => {
    return items.map((item) => (
      <Fragment key={item.id}>
        <p className="tertiary-heading-normal capitalize">{item.name}</p>
        <p className="tertiary-heading-normal text-light justify-self-center">
          {item.quantity}
        </p>
        <p className="tertiary-heading-normal text-light justify-self-end">
          {`$ ${item.price.toFixed(2)}`}
        </p>
        <p className="tertiary-heading-normal justify-self-end">{`$ ${item.total?.toFixed(
          2
        )}`}</p>
      </Fragment>
    ));
  };

  const renderItemsForMobile = () => {
    return items.map((item) => (
      <Fragment key={item.id}>
        <div>
          <p className="tertiary-heading-normal capitalize">{item.name}</p>
          <p className="tertiary-heading-normal text-light justify-self-center">
            {`${item.quantity} x $ ${item.price.toFixed(2)}`}
          </p>
        </div>
        <p className="tertiary-heading-normal justify-self-end">{`$ ${item.total?.toFixed(
          2
        )}`}</p>
      </Fragment>
    ));
  };

  return (
    <LayoutContainer>
      <div className="mb-32">
        <div className="mb-7 md:mb-8">
          <Link to={"../invoices"}>
            <button className="button-back tertiary-heading-normal flex items-center gap-2">
              <IconArrowLeft />
              Go Back
            </button>
          </Link>
        </div>
        <Card className="flex gap-4">
          <div className="flex gap-4 flex-1 justify-between items-center md:justify-normal md:flex-auto">
            <p className="text-body-two text-light capitalize">status</p>
            <StatusCard
              status={status as unknown as (typeof STATUS_TYPES)[number]}
            />
          </div>
          <div className="hidden md:flex gap-2">
            <Link to="./edit">
              <button className="editButton">Edit</button>
            </Link>

            <button
              className="button-delete tertiary-heading-normal !text-ghost-white"
              onClick={openDeleteModal}
            >
              Delete
            </button>
            <MarkAsPaid />
          </div>
        </Card>
        <Card className="mt-10 !p-6 md:!p-12 ">
          <div className="flex flex-col gap-8 md:flex-row justify-between items-start">
            <div>
              <h3 className="tertiary-heading">
                #{id?.slice(-5)?.toUpperCase()}
              </h3>
              <p className="text-body-two text-light capitalize">
                {projectDescription}
              </p>
            </div>
            <p className="text-body-two text-light [&>*]:block md:text-right capitalize">
              <span>{fromAddress}</span>
              <span>{fromCity}</span>
              <span>{fromPostalCode}</span>
              <span>{fromCountry}</span>
            </p>
          </div>
          <div className="grid grid-cols-2 grid-rows-3 gap-6 md:gap-4 mt-8 md:mt-5 md:grid-cols-3 md:grid-rows-2">
            <div className="flex flex-col gap-1">
              <p className="text-body-two text-light">Invoice Date</p>
              <p className="tertiary-heading !text-[15px]">
                {getFormattedDate(invoiceDate)}
              </p>
            </div>
            <div className="flex flex-col gap-2 row-start-2">
              <p className="text-body-two text-light">Payment Due</p>
              <p className="tertiary-heading !text-[15px]">
                {addDaysToPaymentDate(
                  invoiceDate,
                  paymentTerms as keyof typeof PAYMENT_TERMS
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 row-start-1 row-span-2">
              <p className="text-body-two text-light">Bill To</p>
              <p className="tertiary-heading !text-[15px] capitalize">
                {clientName}
              </p>
              <p className="text-body-two text-light [&>*]:block capitalize">
                <span>{clientAddress}</span>
                <span>{clientCity}</span>
                <span>{clientPostalCode}</span>
                <span>{clientCountry}</span>
              </p>
            </div>
            <div>
              <p className="text-body-two text-light">Sent to</p>
              <p className="tertiary-heading !text-[15px]">{clientEmail}</p>
            </div>
          </div>
          <div className="mt-10 p-6 capitalize bg-ghost-white dark:bg-blue-1050  rounded-t-md md:mt-12 md:p-8">
            <div className="hidden md:grid grid-cols-[4fr_1fr_2fr_3fr] gap-y-8 gap-x-4">
              <p className="text-body-two text-light">Item Name</p>
              <p className="text-body-two text-light justify-self-center">
                QTY.
              </p>
              <p className="text-body-two text-light justify-self-end">Price</p>
              <p className="text-body-two text-light justify-self-end">Total</p>
              {renderListItems()}
            </div>
            <div className="grid grid-cols-[2fr_1fr] items-center gap-6 md:hidden">
              {renderItemsForMobile()}
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-1050 gap-4 dark:bg-black-1000 p-6 rounded-b-md md:p-8">
            <p className="text-body-two !text-white">Amount Due</p>
            <div className="text-body-two !text-[24px] !text-white">
              {`$ ${getTotals(items).toFixed(2)}`}
            </div>
          </div>
        </Card>
        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <Card className="flex flex-row justify-between items-center w-full">
            <button className="button-edit tertiary-heading-normal !text-indigo-1050">
              Edit
            </button>
            <button
              className="button-delete tertiary-heading-normal !text-ghost-white"
              onClick={openDeleteModal}
            >
              Delete
            </button>
            <Form method="post">
              <button
                className="button-primary tertiary-heading-normal !text-ghost-white"
                name="intent"
                value="paid"
              >
                Mark as Paid
              </button>
            </Form>
          </Card>
        </div>
      </div>
      {toggleDeleteModal && (
        <DeleteModal onClose={() => setToggleDeleteModal(false)}>
          Are you sure you want to delete invoice #XM9141? This action cannot be
          undone.
        </DeleteModal>
      )}
    </LayoutContainer>
  );
};

export default InvoiceDetailsContainer;
