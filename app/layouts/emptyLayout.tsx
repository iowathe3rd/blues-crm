import React from "react";

export type EmptyLayoutProps = {
  children: JSX.Element;
};

const EmptyLayout: React.FC<EmptyLayoutProps> = ({ children }) => {
  return (
    <div
      className={
        "container m-auto flex min-h-screen w-full items-center justify-center"
      }
    >
      {children}
    </div>
  );
};

export default EmptyLayout;
