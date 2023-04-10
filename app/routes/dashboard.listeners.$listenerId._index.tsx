import React from "react";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import Table from "~/components/table/Table";
import EmptyLayout from "~/layouts/emptyLayout";
import { dateTimeToString } from "~/utils/dateTools";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import Spinner from "~/components/spinner";
import UserCard from "~/components/userCard";

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  await requireUserId(request);
  const user = await prisma.user.findUnique({
    where: {
      id: params.listenerId,
    },
  });
  const coursesData = await prisma.listenersOnCourse.findMany({
    where: {
      listenerId: params.listenerId,
    },
    select: {
      id: true,
      course: {
        select: {
          id: true,
          title: true,
          assignedAt: true,
          minimumScore: true,
          authorFirstName: true,
          authorLastName: true,
          authorSurName: true,
          hoursCount: true,
        },
      },
      score: true,
      finished: true,
    },
  });
  const courses = coursesData.map((course) => {
    return {
      id: course.id,
      title: course.course.title,
      finished: dateTimeToString(String(course.finished)),
      score: course.score,
      author: `${course.course.authorLastName} ${course.course.authorFirstName} ${course.course.authorSurName}`,
      hoursCount: course.course.hoursCount,
    };
  });
  return json({ user, courses });
};

const UserIndexPage: React.FC = () => {
  const { user, courses } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  if (state === "loading") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  }
  const columns = [
    { label: "Название", accessor: "title", sortable: false },
    { label: "Закончен", accessor: "finished", sortable: true },
    { label: "Автор", accessor: "author", sortable: false },
    { label: "Кол-во часов", accessor: "hoursCount", sortable: true },
    { label: "Балл", accessor: "score", sortable: true },
  ];
  return (
    <div className={"flex flex-col gap-4"}>
      <UserCard data={user} />
      {courses.length >= 1 ? (
        <>
          <div className="divider">Курсы проходящие пользователь</div>
          <Table
            tableType={"table-compact"}
            data={courses}
            columns={columns}
            link={true}
            linkPath={`Перейти`}
            linkTitle={"Перейти"}
          />
        </>
      ) : (
        <div className="divider">Пользователь еще не прошел курсов</div>
      )}
    </div>
  );
};

export default UserIndexPage;
