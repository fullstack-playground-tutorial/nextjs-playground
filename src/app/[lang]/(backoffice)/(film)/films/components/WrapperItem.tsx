"use client";

import React from "react";

const WrapperItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="italic text-base font-normal font-serif text-orange-500 hover:underline hover:underline-offset-2">
      {children}
    </div>
  );
};

export default WrapperItem;
