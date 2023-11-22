import { useState } from "react";
import { IconArrowDown } from "~/assets/icons";
import { STATUS_TYPES } from "~/constants/invoices.contants";
import CustomCheckbox from "./form/CustomCheckbox";

const FilterStatus = () => {
  const [toggleStatusMenu, setToggleStatusMenu] = useState(false);

  const handleToggleStatusMenu = () =>
    setToggleStatusMenu((prevState) => !prevState);

  const renderCheckbox = () => {
    return STATUS_TYPES.map((status) => {
      return <CustomCheckbox key={status} label={status} />;
    });
  };

  const renderStatusMenu = () => {
    return (
      <div className="absolute top-10 left-[-25%]">
        {toggleStatusMenu && (
          <div className="max-w-[12rem] w-40 px-6 py-4 bg-white dark:bg-blue-1050 rounded-lg">
            <div className="flex flex-col gap-2">{renderCheckbox()}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2"
        onClick={handleToggleStatusMenu}
      >
        <h4 className="tertiary-heading-normal first-letter:capitalize">
          filter by status
        </h4>
        <IconArrowDown />
      </button>
      {renderStatusMenu()}
    </div>
  );
};

export default FilterStatus;
