import React from "react";
import DashboardLayout from "~/layouts/dashboardLayout";
import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = ({ request }) => {
  return requireUserId(request);
};

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;
