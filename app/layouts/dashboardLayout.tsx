import React from "react";
import Navbar from "~/components/navbar";
import DrawerSide from "~/components/drawerSide";

export type DashboardLayoutProps = {
  children: JSX.Element | JSX.Element[];
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="drawer-mobile drawer">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content sm:overflow-hidden">
          <div>
            <div className={"p-4"}>{children}</div>
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <DrawerSide />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
