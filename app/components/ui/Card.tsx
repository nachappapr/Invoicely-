import clsx from "clsx";
import React from "react";

const Card = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx(
        `bg-white rounded-lg py-6 px-4 shadow-md dark:bg-blue-1000 border-[1px] border-transparent ${className}`
      )}
    >
      {children}
    </div>
  );
};

export default Card;
