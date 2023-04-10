import React from "react";
import type { ActionArgs, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import EmptyLayout from "~/layouts/emptyLayout";

import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { validateString } from "~/utils/validate.server";
import Spinner from "~/components/spinner";
import Card from "~/components/card";
import { FormControl } from "~/components/formControl";

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  await requireUserId(request);
  const courseData = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
  });
  if (!courseData) return new Error("COURSE NOT FOUND");
  const fields = {
    courseTitle: courseData.title,
    hoursCount: courseData.hoursCount,
    minimumScore: courseData.minimumScore,
    assignedAt: courseData.assignedAt,
  };
  return json({ fields });
};
export const action = async ({ request, params }: ActionArgs) => {
  //Получение данных из отправленой формы
  const form = await request.formData();
  const courseTitle = form.get("courseTitle");
  const hoursCount = Number(form.get("hoursCount"));
  const minimumScore = Number(form.get("minimumScore"));
  const assignedAt = form.get("assignedAt");
  const fields = { courseTitle, hoursCount, minimumScore, assignedAt };
  //Начальная валидация
  if (typeof courseTitle !== "string" || typeof assignedAt !== "string") {
    //Отправка ответа с ошибками
    return badRequest({
      fields: null,
      formError: `Форма была заполнена неверно`,
    });
  }
  const fieldErrors = {
    courseTitle: validateString(courseTitle),
    assignedAt: validateString(assignedAt),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const courseUpdateData = {
    title: courseTitle,
    hoursCount: hoursCount,
    minimumScore: minimumScore,
    assignedAt: assignedAt,
  };
  const updatedCourse = await prisma.course.update({
    where: {
      id: params.courseId,
    },
    data: courseUpdateData,
  });
  if (!updatedCourse) {
    return badRequest({
      fieldErrors,
      fields,
      formError: `При обновлении курса что то пошло не так`,
    });
  }
  return redirect(`/dashboard/courses/${updatedCourse.id}`);
};
const EditCourse: React.FC = () => {
  const { fields } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const { state } = useNavigation();
  if (state === "submitting") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  } else if (state === "loading") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  }
  return (
    <div className={"flex justify-center"}>
      <Card
        title={"Создать курс"}
        linkPath={"/dashboard/courses"}
        linkTitle={"Отменить"}
        width={"max-w-full"}
      >
        <Form method={"post"}>
          <FormControl
            actionData={{
              value: actionData?.fields?.courseTitle ?? fields.courseTitle,
              fieldError: actionData?.fieldErrors?.courseTitle,
            }}
            title={"Название курса"}
            placeholder={"Курс по ..."}
            type={"text"}
            name={"courseTitle"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.hoursCount ?? fields.hoursCount,
              fieldError: actionData?.fieldErrors?.hoursCount,
            }}
            title={"Кол-во часов"}
            placeholder={"Количество часов в цифрах"}
            type={"number"}
            name={"hoursCount"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.minimumScore ?? fields.minimumScore,
              fieldError: actionData?.fieldErrors?.minimumScore,
            }}
            title={"Проходной бал"}
            placeholder={"Количество балов в цифрах"}
            type={"number"}
            name={"minimumScore"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.assignedAt ?? fields.assignedAt,
              fieldError: actionData?.fieldErrors?.assignedAt,
            }}
            title={"Дата начала"}
            placeholder={""}
            type={"text"}
            name={"assignedAt"}
          />

          <div id="form-error-message">
            {actionData?.formError ? (
              <div className="alert alert-error shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 flex-shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{actionData.formError}</span>
                </div>
              </div>
            ) : null}
          </div>
          <button className={"btn-primary btn-block btn"} type={"submit"}>
            Изменить
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default EditCourse;
