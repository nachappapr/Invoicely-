import { IconCheck } from "~/assets/icons";

type StatusCheckboxProps = {
  label: string;
  checked: boolean;
  handleSelectStatus: (status: string) => void;
};

const StatusCheckbox = ({
  label,
  checked,
  handleSelectStatus,
}: StatusCheckboxProps) => {
  return (
    <div className="group/item flex items-center relative capitalize">
      <input
        id={label}
        type="checkbox"
        checked={checked}
        onChange={() => handleSelectStatus(label)}
        className="peer w-4 h-4 appearance-none bg-indigo-1000 dark:bg-blue-1000 border-[1.5px] border-transparent cursor-pointer rounded-sm group-hover/item:border-purple-1000 checked:bg-purple-1000 dark:checked:bg-purple-1050 checked:border-none transition-colors ease-in-out duration-200"
      />
      <label
        htmlFor={label}
        className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer tertiary-heading-normal"
      >
        {label}
      </label>
      <div className="absolute hidden peer-checked:block top-[5px] left-[3px] pointer-events-none">
        <IconCheck />
      </div>
    </div>
  );
};

export default StatusCheckbox;
