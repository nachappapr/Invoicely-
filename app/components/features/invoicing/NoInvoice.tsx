import { IllustrationEmpty } from "~/assets/icons";

type NoInvoiceProps = {
  title?: string;
  description?: string;
};

const NoInvoice = ({ title, description }: NoInvoiceProps) => {
  const renderDescription = () => {
    return description ? (
      <p className="text-body-one max-w-md mx-auto text-center mt-6 leading-none !text-indigo-2000 dark:!text-indigo-1000 first-letter:capitalize">
        {description}
      </p>
    ) : (
      <p className="text-body-one max-w-md mx-auto text-center mt-6 leading-none !text-indigo-2000 dark:!text-indigo-1000 first-letter:capitalize">
        Create an invoice by clicking the &nbsp;
        <strong className="tertiary-heading-normal !text-indigo-2000 dark:!text-indigo-1000">
          New Invoice
        </strong>
        &nbsp;button and get started
      </p>
    );
  };

  return (
    <div className="flex mt-20 flex-col justify-center items-center">
      <IllustrationEmpty />
      <h2 className="secondary-heading mt-10  md:mt-12">
        {title ?? "There is nothing here"}
      </h2>
      {renderDescription()}
    </div>
  );
};

export default NoInvoice;
