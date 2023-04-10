import React from "react";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import EmptyLayout from "~/layouts/emptyLayout";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { validateString } from "~/utils/validate.server";
import { prisma } from "~/db.server";
import Spinner from "~/components/spinner";
import Card from "~/components/card";
import { FormControl } from "~/components/formControl";
import { badRequest } from "~/utils/request.server";

export const loader: LoaderFunction = ({ request }) => {
  return requireUserId(request);
};

export const action = async ({ request }: ActionArgs) => {
  //Получение данных из отправленой формы
  const form = await request.formData();
  const courseTitle = form.get("courseTitle");
  const hoursCount = Number(form.get("hoursCount"));
  const minimumScore = Number(form.get("minimumScore"));
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const surName = form.get("surName");
  const fields = {
    courseTitle,
    hoursCount,
    minimumScore,
    firstName,
    lastName,
    surName,
  };
  //Начальная валидация
  if (
    typeof courseTitle !== "string" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof surName !== "string"
  ) {
    //Отправка ответа с ошибками
    return badRequest({
      fields: null,
      formError: `Форма была заполнена неверно`,
    });
  }
  const fieldErrors = {
    courseTitle: validateString(courseTitle),
    firstName: validateString(firstName),
    lastName: validateString(lastName),
    surName: validateString(surName),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const course = await prisma.course.create({
    data: {
      title: courseTitle,
      minimumScore: minimumScore,
      hoursCount: hoursCount,
      authorLastName: lastName,
      authorFirstName: firstName,
      authorSurName: surName,
    },
  });
  if (!course) {
    return badRequest({
      fields: fields,
      formError: `Не получилось создать курс`,
    });
  }
  return redirect(`/dashboard/courses/${course.id}`);
};
const CreateCourse: React.FC = () => {
  const actionData = useActionData();
  const { state } = useNavigation();
  if (state === "loading") {
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
              value: actionData?.fields?.courseTitle,
              fieldError: actionData?.fieldErrors?.courseTitle,
            }}
            title={"Название курса"}
            placeholder={"Название"}
            type={"text"}
            name={"courseTitle"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.hoursCount,
              fieldError: actionData?.fieldErrors?.hoursCount,
            }}
            title={"Кол-во часов"}
            placeholder={"Количество часов в цифрах"}
            type={"number"}
            name={"hoursCount"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.minimumScore,
              fieldError: actionData?.fieldErrors?.minimumScore,
            }}
            title={"Проходной бал"}
            placeholder={"Количество балов в цифрах"}
            type={"number"}
            name={"minimumScore"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.lastName,
              fieldError: actionData?.fieldErrors?.lastName,
            }}
            title={"Фамилия коуча"}
            placeholder={"Иванович"}
            type={"text"}
            name={"lastName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.firstName,
              fieldError: actionData?.fieldErrors?.firstName,
            }}
            title={"Имя коуча"}
            placeholder={"Иван"}
            type={"text"}
            name={"firstName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.surName,
              fieldError: actionData?.fieldErrors?.surName,
            }}
            title={"Отчество коуча"}
            placeholder={"Иванов"}
            type={"text"}
            name={"surName"}
          />

          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData.formError}
              </p>
            ) : null}
          </div>
          <button className={"btn-primary btn-block btn"} type={"submit"}>
            Добавить
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateCourse;
