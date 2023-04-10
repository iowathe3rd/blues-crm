import React from "react";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";
import Table from "~/components/table/Table";
import EmptyLayout from "~/layouts/emptyLayout";
import Spinner from "~/components/spinner";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import CourseCard from "~/components/courseCard";

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  await requireUserId(request);
  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  if (!course) return redirect("/dashboard");
  const listenerData = await prisma.listenersOnCourse.findMany({
    where: {
      course: {
        id: course.id,
      },
    },
    select: {
      id: true,
      listener: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          surName: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });
  const listeners = listenerData.map((data) => {
    return {
      id: data.id,
      firstName: data.listener.firstName,
      lastName: data.listener.lastName,
      surName: data.listener.surName,
      email: data.listener.email,
      phoneNumber: data.listener.phoneNumber,
    };
  });
  return json({
    course,
    listeners,
  });
};

const CoursesIndex: React.FC = () => {
  const { course, listeners } = useLoaderData();
  const { state } = useNavigation();
  if (state === "loading") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  }

  const columns = [
    { label: "Email", accessor: "email", sortable: false },
    { label: "Имя", accessor: "firstName", sortable: true },
    { label: "Фамилия", accessor: "lastName", sortable: true },
    { label: "Отчество", accessor: "surName", sortable: true },
    { label: "Номер телефона", accessor: "phoneNumber", sortable: true },
  ];
  const cardActions = (
    <>
      <Link to={`edit`} className={"btn-primary btn-block btn"}>
        Изменить
      </Link>
      <Form method={"post"} action={"delete"}>
        <input type="hidden" value={course.id} name={"courseId"} />
        <button type={"submit"} className={"btn-error btn-block btn"}>
          Удалить
        </button>
      </Form>
    </>
  );
  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
        <CourseCard
          course={course}
          courseListenersLength={listeners.length}
          children={cardActions}
        />
      </div>

      {listeners.length ? (
        <>
          <div className="divider">Прошедшие курс</div>
          <Table
            data={listeners}
            columns={columns}
            link={true}
            linkPath={`/dashboard/results/`}
            linkTitle={"Подробнее"}
          />
        </>
      ) : (
        <>
          <div className="divider">У данного курса нет слушателей</div>
        </>
      )}
    </div>
  );
};

export default CoursesIndex;
