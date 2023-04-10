import React from "react";

import Table from "~/components/table/Table";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Link, useLoaderData, useNavigation } from "@remix-run/react";

import EmptyLayout from "~/layouts/emptyLayout";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import Spinner from "~/components/spinner";
import ToolBar from "~/components/toolbar";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const results = await prisma.listenersOnCourse.findMany({
    select: {
      id: true,
      course: true,
      assignedAt: true,
      listener: true,
      score: true,
    },
  });
  const data: Array<any> = results.map((dataItem) => {
    return {
      id: dataItem.id,
      listener: `${dataItem.listener.firstName} ${dataItem.listener.lastName} ${dataItem.listener.surName}`,
      score: dataItem.score,
      courseName: dataItem.course.title,
    };
  });
  return json(data);
};
const ResultsIndex: React.FC = () => {
  const { state } = useNavigation();
  const data = useLoaderData<typeof loader>();
  if (state === "loading") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  }
  const columns = [
    { label: "Фио слушателя", accessor: "listener", sortable: true },
    { label: "Бал", accessor: "score", sortable: true },
    { label: "Курс", accessor: "courseName", sortable: true },
  ];

  const toolbarItems = [
    { label: "Добавить результат", icon: null, linkPath: "add" },
  ];
  return (
    <div className={"flex flex-col gap-4"}>
      <ToolBar items={toolbarItems} />

      {data.length == 0 ? (
        <div className="divider">
          На данный момент результатов нет
          <Link to={"add"} className={"btn-primary btn-sm btn"}>
            Добавить
          </Link>
        </div>
      ) : (
        <Table
          data={data}
          columns={columns}
          link={true}
          linkPath={`/dashboard/results/`}
          linkTitle={"Подробнее"}
        />
      )}
    </div>
  );
};

export default ResultsIndex;
