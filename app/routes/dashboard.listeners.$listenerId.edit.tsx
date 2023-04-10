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
import { validatePhoneNumber, validateString } from "~/utils/validate.server";
import Spinner from "~/components/spinner";
import Card from "~/components/card";
import { FormControl } from "~/components/formControl";

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  await requireUserId(request);
  const userData = await prisma.user.findUnique({
    where: {
      id: params.listenerId,
    },
  });
  return json({ fields: userData });
};
export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData();
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const surName = form.get("surName");
  const email = form.get("email");
  const phoneNumber = form.get("phoneNumber");
  const workPlace = form.get("workPlace");
  const fields = {
    firstName,
    lastName,
    surName,
    email,
    phoneNumber,
    workPlace,
  };

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof surName !== "string" ||
    typeof email !== "string" ||
    typeof phoneNumber !== "string" ||
    typeof workPlace !== "string"
  ) {
    //Отправка ответа с ошибками
    return badRequest({
      fields: null,
      formError: `Форма была заполнена неверно`,
    });
  }
  const fieldErrors = {
    firstName: validateString(firstName),
    lastName: validateString(lastName),
    surName: validateString(surName),
    email: validateString(email),
    phoneNumber: validatePhoneNumber(phoneNumber),
    workPlace: validateString(workPlace),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: params.listenerId,
    },
    data: {
      firstName,
      lastName,
      surName,
      email,
      workPlace,
    },
  });
  return redirect(`/dashboard/listeners/${updatedUser.id}`);
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
        title={"Изменить данные пользователя"}
        linkPath={"/dashboard/listeners"}
        linkTitle={"Отменить"}
        width={"max-w-full"}
      >
        <Form method={"post"}>
          <FormControl
            actionData={{
              value: actionData?.fields?.firstName ?? fields?.firstName,
              fieldError: actionData?.fieldErrors?.firstName,
            }}
            title={"Имя"}
            placeholder={"Иван"}
            type={"text"}
            name={"firstName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.lastName ?? fields?.lastName,
              fieldError: actionData?.fieldErrors?.lastName,
            }}
            title={"Фамилия"}
            placeholder={"Иванович"}
            type={"text"}
            name={"lastName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.surName ?? fields?.surName,
              fieldError: actionData?.fieldErrors?.surName,
            }}
            title={"Отчество"}
            placeholder={"Иванов"}
            type={"text"}
            name={"surName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.email ?? fields?.email,
              fieldError: actionData?.fieldErrors?.email,
            }}
            title={"Email"}
            placeholder={"example@mail.ru"}
            type={"text"}
            name={"email"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.phoneNumber ?? fields?.phoneNumber,
              fieldError: actionData?.fieldErrors?.phoneNumber,
            }}
            title={"Номер телефона"}
            placeholder={"+78887775522"}
            type={"text"}
            name={"phoneNumber"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.workPlace ?? fields?.workPlace,
              fieldError: actionData?.fieldErrors?.workPlace,
            }}
            title={"Место работы"}
            placeholder={"Название/аддрес"}
            type={"text"}
            name={"workPlace"}
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
