import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import Table from "~/components/table/Table";
import EmptyLayout from "~/layouts/emptyLayout";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import Spinner from "~/components/spinner";
import ToolBar from "~/components/toolbar";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const listeners = await prisma.user.findMany({
    where: {
      role: "USER",
    },
  });
  return json(listeners);
};

const ListenersIndex = () => {
  const { state } = useNavigation();
  const listeners = useLoaderData<typeof loader>();
  if (state === "loading") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  }
  const toolbarItems = [
    {
      label: "Добавить",
      icon: null,
      linkPath: "/dashboard/listeners/create",
    },
  ];
  const columns = [
    { label: "Email", accessor: "email", sortable: false },
    { label: "Имя", accessor: "firstName", sortable: true },
    { label: "Фамилия", accessor: "lastName", sortable: true },
    { label: "Отчество", accessor: "surName", sortable: true },
    { label: "Номер телефона", accessor: "phoneNumber", sortable: true },
  ];
  return (
    <div className={"flex flex-col gap-4"}>
      <ToolBar items={toolbarItems} />
      {listeners.length == 0 ? (
        <div className="divider">
          На данный момент слушателей нет
          <Link to={"create"} className={"btn-primary btn-sm btn"}>
            Добавить
          </Link>
        </div>
      ) : (
        <Table
          data={listeners}
          columns={columns}
          linkTitle={"Перейти"}
          link={true}
          linkPath={"/dashboard/listeners/"}
        />
      )}
    </div>
  );
};

export default ListenersIndex;
