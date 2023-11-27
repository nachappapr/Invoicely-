import React from "react";

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-[60.33rem] mx-auto w-[90%] mt-8 md:mt-14 lg:w-full lg:mt-20 items-center justify-center mb-10">
      {children}
    </div>
  );
};

export default LayoutContainer;
