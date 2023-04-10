import React from "react";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import EmptyLayout from "~/layouts/emptyLayout";
import Spinner from "~/components/spinner";
import Table from "~/components/table/Table";
import ToolBar from "~/components/toolbar";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  await requireUserId(request);
  const coursesData = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      minimumScore: true,
      assignedAt: true,
      hoursCount: true,
      authorFirstName: true,
      authorLastName: true,
      authorSurName: true,
    },
  });
  const courses: Array<any> = coursesData.map((course) => {
    return {
      id: course.id,
      title: course.title,
      minimumScore: course.minimumScore,
      assignedAt: course.assignedAt
        .toLocaleString("en-GB", { timeZone: "Asia/Almaty" })
        .toString(),
      hoursCount: course.hoursCount,
      author: `${course.authorFirstName} ${course.authorLastName} ${course.authorSurName}`,
    };
  });
  return json(courses);
};

const DashboardCoursesIndex = () => {
  const courses = useLoaderData<typeof loader>();
  const { state } = useNavigation();
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
      linkPath: "/dashboard/courses/create",
    },
  ];
  const columns = [
    { label: "Название", accessor: "title", sortable: false },
    { label: "Проходной бал", accessor: "minimumScore", sortable: true },
    { label: "Создан", accessor: "assignedAt", sortable: true },
    { label: "Автор", accessor: "author", sortable: false },
    { label: "Кол-во часов", accessor: "hoursCount", sortable: true },
  ];

  return (
    <div className={"flex flex-col gap-4"}>
      <ToolBar items={toolbarItems} />
      {courses.length == 0 ? (
        <div className="divider">
          На данный момент курсов нет
          <Link to={"create"} className={"btn-primary btn-sm btn"}>
            Добавить
          </Link>
        </div>
      ) : (
        <Table
          tableType={"table-compact"}
          data={courses}
          columns={columns}
          link={true}
          linkPath={"/dashboard/courses/"}
          linkTitle={"Перейти"}
        />
      )}
    </div>
  );
};

export default DashboardCoursesIndex;
