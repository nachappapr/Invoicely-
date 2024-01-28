import { IconArrowLeft } from "~/assets/icons";
import StatusCard from "../StatusCard";
import Card from "../ui/Card";
import LayoutContainer from "../ui/LayoutContainer";
import { useNavigate } from "@remix-run/react";

const InvoiceDetailsContainer = () => {
  const navigate = useNavigate();
  const handleNavigation = () => navigate(-1);

  return (
    <LayoutContainer>
      <div className="mb-32">
        <div className="mb-7 md:mb-8">
          <button
            className="button-back tertiary-heading-normal flex items-center gap-2"
            onClick={handleNavigation}
          >
            <IconArrowLeft />
            Go Back
          </button>
        </div>
        <Card className="flex gap-4">
          <div className="flex gap-4 flex-1 justify-between items-center md:justify-normal md:flex-auto">
            <p className="text-body-two text-light capitalize">status</p>
            <StatusCard status="pending" />
          </div>
          <div className="hidden md:flex gap-2">
            <button className="button-edit tertiary-heading-normal !text-indigo-1050">
              Edit
            </button>
            <button className="button-delete tertiary-heading-normal !text-ghost-white">
              Delete
            </button>
            <button className="button-primary tertiary-heading-normal !text-ghost-white">
              Mark as Paid
            </button>
          </div>
        </Card>
        <Card className="mt-10 !p-6 md:!p-12 ">
          <div className="flex flex-col gap-8 md:flex-row justify-between items-start">
            <div>
              <h3 className="tertiary-heading">#XM9141</h3>
              <p className="text-body-two text-light">Graphic Design</p>
            </div>
            <p className="text-body-two text-light [&>*]:block md:text-right">
              <span>19 Union Terrace</span>
              <span>London</span>
              <span>E1 3EZ</span>
              <span>United Kingdom</span>
            </p>
          </div>
          <div className="grid grid-cols-2 grid-rows-3 gap-6 md:gap-4 mt-8 md:mt-5 md:grid-cols-3 md:grid-rows-2">
            <div className="flex flex-col gap-1">
              <p className="text-body-two text-light">Invoice Date</p>
              <p className="tertiary-heading !text-[15px]">19 Aug 2021</p>
            </div>
            <div className="flex flex-col gap-2 row-start-2">
              <p className="text-body-two text-light">Payment Due</p>
              <p className="tertiary-heading !text-[15px]">20 Sep 2021</p>
            </div>
            <div className="flex flex-col gap-2 row-start-1 row-span-2">
              <p className="text-body-two text-light">Bill To</p>
              <p className="tertiary-heading !text-[15px]">Alex Grim</p>
              <p className="text-body-two text-light [&>*]:block ">
                <span>19 Union Terrace</span>
                <span>London</span>
                <span>E1 3EZ</span>
                <span>United Kingdom</span>
              </p>
            </div>
            <div>
              <p className="text-body-two text-light">Sent to</p>
              <p className="tertiary-heading !text-[15px]">alexgrim@mail.com</p>
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
              <p className="tertiary-heading-normal">Banner Design</p>
              <p className="tertiary-heading-normal text-light justify-self-center">
                1
              </p>
              <p className="tertiary-heading-normal text-light justify-self-end">
                $158.00
              </p>
              <p className="tertiary-heading-normal justify-self-end">
                $158.00
              </p>
            </div>
            <div className="grid grid-cols-[2fr_1fr] items-center gap-6 md:hidden">
              <div>
                <p className="tertiary-heading-normal">Banner Design</p>
                <p className="tertiary-heading-normal text-light justify-self-center">
                  1 x $156.00
                </p>
              </div>
              <p className="tertiary-heading-normal justify-self-end">
                $158.00
              </p>
              <div>
                <p className="tertiary-heading-normal">Banner Design</p>
                <p className="tertiary-heading-normal text-light justify-self-center">
                  1 x $156.00
                </p>
              </div>
              <p className="tertiary-heading-normal justify-self-end">
                $158.00
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center bg-gray-1050 gap-4 dark:bg-black-1000 p-6 rounded-b-md md:p-8">
            <p className="text-body-two !text-white">Amount Due</p>
            <div className="text-body-two !text-[24px] !text-white">
              £ 556.00
            </div>
          </div>
        </Card>
        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <Card className="flex flex-row justify-between items-center w-full">
            <button className="button-edit tertiary-heading-normal !text-indigo-1050">
              Edit
            </button>
            <button className="button-delete tertiary-heading-normal !text-ghost-white">
              Delete
            </button>
            <button className="button-primary tertiary-heading-normal !text-ghost-white">
              Mark as Paid
            </button>
          </Card>
        </div>
      </div>
    </LayoutContainer>
  );
};

export default InvoiceDetailsContainer;
