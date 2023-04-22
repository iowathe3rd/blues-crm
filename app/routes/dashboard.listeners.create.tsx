import React, { useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import EmptyLayout from "~/layouts/emptyLayout";
import type {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";
import {
  validatePassword,
  validatePasswordSimilarity,
  validatePhoneNumber,
  validateString
} from "~/utils/validate.server";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";
import Spinner from "~/components/spinner";
import Card from "~/components/card";
import { FormControl } from "~/components/formControl";
import bcrypt from "bcryptjs";

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const firstName = form.get("firstName");
  const lastName = form.get("lastName");
  const surName = form.get("surName");
  const email = form.get("email");
  const phoneNumber = form.get("phoneNumber");
  const workPlace = form.get("workPlace");
  const role = form.get("role");
  const password = form.get("password") as string;
  const passwordSimilarity = form.get("passwordSimilarity") as string;
  let fields: object;
  let fieldErrors: object;

  fields = {
    firstName,
    lastName,
    surName,
    email,
    phoneNumber,
    workPlace,
  }

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

  fieldErrors = {
    firstName: validateString(firstName),
    lastName: validateString(lastName),
    surName: validateString(surName),
    email: validateString(email),
    phoneNumber: validatePhoneNumber(phoneNumber),
    workPlace: validateString(workPlace),
  };


  if(role === "on"){
    fieldErrors = {
      firstName: validateString(firstName),
      lastName: validateString(lastName),
      surName: validateString(surName),
      email: validateString(email),
      phoneNumber: validatePhoneNumber(phoneNumber),
      workPlace: validateString(workPlace),
      password: validatePassword(password),
      passwordSimilarity: validatePasswordSimilarity(password, passwordSimilarity),
    }
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }

  let user;
  if(role === "on"){
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        surName,
        email,
        phoneNumber,
        workPlace,
        role: role === "on" ? "ADMIN" : "USER",
        passwordHash: hashedPassword,
      },
    });
  }
  if (!user)
    return badRequest({
      fields,
      formError: `При создании пользователя произошла ошибка`,
    });

  return redirect(`/dashboard/listeners/${user.id}`);
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const userRole = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });
  return json({ userId, userRole });
};

const CreateUserPage: React.FC = () => {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  const { state } = useNavigation();
  const [isAdmin, setAdmin] = useState<boolean>(false)
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

  function handleAdminChecbox(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.checked;
    setAdmin(val)
  }

  return (
    <div className={"flex justify-center"}>
      <Card
        title={"Создать cлушателя"}
        linkPath={"/dashboard/listeners"}
        linkTitle={"Отменить"}
        width={"max-w-full"}
      >
        <Form method={"post"}>
          <FormControl
            actionData={{
              value: actionData?.fields?.lastName,
              fieldError: actionData?.fieldErrors?.lastName,
            }}
            title={"Фамилия"}
            placeholder={"Иванович"}
            type={"text"}
            name={"lastName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.firstName,
              fieldError: actionData?.fieldErrors?.firstName,
            }}
            title={"Имя"}
            placeholder={"Иван"}
            type={"text"}
            name={"firstName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.surName,
              fieldError: actionData?.fieldErrors?.surName,
            }}
            title={"Отчество"}
            placeholder={"Иванов"}
            type={"text"}
            name={"surName"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.email,
              fieldError: actionData?.fieldErrors?.email,
            }}
            title={"Email"}
            placeholder={"example@mail.ru"}
            type={"text"}
            name={"email"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.phoneNumber,
              fieldError: actionData?.fieldErrors?.phoneNumber,
            }}
            title={"Номер телефона"}
            placeholder={"+78887775522"}
            type={"text"}
            name={"phoneNumber"}
          />
          <FormControl
            actionData={{
              value: actionData?.fields?.workPlace,
              fieldError: actionData?.fieldErrors?.workPlace,
            }}
            title={"Место работы"}
            placeholder={"Название/аддрес"}
            type={"text"}
            name={"workPlace"}
          />
          {isAdmin &&
            <>
              <FormControl
              actionData={{
                value: actionData?.fields?.password,
                fieldError: actionData?.fieldErrors?.password
              }}
              title={"Пароль"}
              placeholder={"Пароль"}
              type={"password"}
              name={"password"} />
              <FormControl
              actionData={{
                value: actionData?.fields?.password,
                fieldError: actionData?.fieldErrors?.password
              }}
              title={"Повторите пароль"}
              placeholder={"Пароль"}
              type={"password"}
              name={"passwordSimilarity"} />
            </>
          }

          {loaderData.userRole.role === "SUPER_ADMIN" &&
            <div>
              <div className="divider"></div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Админ</span>
                  <input type="checkbox" name={"role"} className="toggle" onChange={(e)=>handleAdminChecbox(e)}/>
                </label>
              </div>
            </div>
          }
          <div className="divider"></div>
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
            Добавить
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUserPage;
