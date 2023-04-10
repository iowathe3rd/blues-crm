import React, { useState } from "react";
import type {
  ActionFunction,
  LoaderFunction,
  UploadHandler,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";

import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import { badRequest } from "~/utils/request.server";

import { composeUploadHandlers } from "@remix-run/server-runtime/dist/formData";
import { createMemoryUploadHandler } from "@remix-run/server-runtime/dist/upload/memoryUploadHandler";
import { getTimeDifference } from "~/utils/dateTools";
import { prisma } from "~/db.server";
import { requireUserId } from "~/session.server";
import Card from "~/components/card";
import { FormControl } from "~/components/formControl";
import EmptyLayout from "~/layouts/emptyLayout";
import Spinner from "~/components/spinner";
import { supabase } from "~/utils/supabase.server";
import {
  validateExistingCourse,
  validateExistingUser,
  validateNumber,
} from "~/utils/validate.server";
import { v4 as uuidv4 } from "uuid";
import Select from "~/components/select";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const usersData = await prisma.user.findMany({
    where: {
      role: "USER",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      surName: true,
    },
  });
  const coursesData = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
    },
  });

  const courses = coursesData.map((course) => {
    return {
      id: course.id,
      title: course.title,
      value: course.id,
    };
  });
  const users: Array<any> = usersData.map((user) => {
    return {
      id: user.id,
      title: `${user.firstName} ${user.lastName} ${user.surName}`,
      value: user.id,
    };
  });
  return json({ users, courses });
};

export const action: ActionFunction = async ({ request }) => {
  // @ts-ignore
  let fileUploadHandler: UploadHandler = async ({
    name,
    filename,
    contentType,
    data,
  }) => {
    try {
      if (name !== "paymentInfo" || filename === "") {
        return null;
      } else {
        console.log(name);
      }
      if (!filename) return new Error("FILE IS NOT EXIST");
      const ext = filename.split(" ").pop();
      filename = `${uuidv4()}.${ext}`;
      const chunks = [];
      for await (const chunk of data) chunks.push(chunk);
      return new File(chunks, filename, {
        type: contentType,
      });
    } catch (e) {
      console.log(e);
    }
  };
  const uploadHandler = composeUploadHandlers(
    fileUploadHandler,
    createMemoryUploadHandler()
  );
  const form = await unstable_parseMultipartFormData(request, uploadHandler);
  const userId = form.get("userId");
  const courseId = form.get("courseId");
  const score = Number(form.get("score"));
  const paymentInfo = form.get("paymentInfo") as File;
  const fields = { userId, courseId, score };
  if (
    typeof userId !== "string" ||
    typeof courseId !== "string" ||
    !paymentInfo
  ) {
    //Отправка ответа с ошибками
    return badRequest({
      fields: fields,
      fieldErrors: null,
      formError: `Форма была заполнена неверно или не прикреплен файл`,
    });
  }
  const fieldErrors = {
    userId: await validateExistingUser(userId),
    courseId: await validateExistingCourse(courseId),
    score: validateNumber(score),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({
      fieldErrors,
      fields,
      formError: `Форма заполнена неверно`,
    });
  }
  const resultCandidate = await prisma.listenersOnCourse.findFirst({
    where: {
      courseId: courseId,
      listenerId: userId,
    },
  });

  if (resultCandidate)
    return badRequest({
      fieldErrors,
      fields,
      formError: `Данному пользователю уже выставлен результат по данному курсу`,
    });
  const courseInfo = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      assignedAt: true,
      minimumScore: true,
    },
  });
  if (!courseInfo) return new Error("COURSE NOT FOUND");
  const { error, data: uploadedFile } = await supabase.storage
    .from("main")
    .upload(paymentInfo.name, paymentInfo);
  console.log(error);
  if (error)
    return badRequest({
      fieldErrors: null,
      fields,
      formError: `Произошла непредвиденная серверная ошибка. `,
    });
  const finished = new Date();
  const duration = getTimeDifference(courseInfo.assignedAt, finished);
  let data;
  if (score < courseInfo.minimumScore) {
    data = {
      courseId: courseId,
      listenerId: userId,
      score: score,
      paymentInfo: uploadedFile.path,
      finished,
      duration: String(duration),
      certificateAvailable: false,
    };
  } else {
    data = {
      courseId: courseId,
      listenerId: userId,
      score: score,
      paymentInfo: uploadedFile.path,
      finished,
      duration: String(duration),
      certificateAvailable: true,
    };
  }
  const courseResult = await prisma.listenersOnCourse.create({
    // @ts-ignore
    data: data,
  });
  if (!courseResult)
    return badRequest({
      fieldErrors,
      fields,
      formError: `что то пошло не так`,
    });
  return redirect(`/dashboard/results/${courseResult.id}`);
};

const ResultAddPage: React.FC = () => {
  const { users, courses } = useLoaderData();
  const { state } = useNavigation();
  const actionData = useActionData();
  const [user, setUser] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);

  function handleUserSelect(id: string) {
    setUser(id);
  }

  function handleCourseSelect(id: string) {
    setCourse(id);
  }
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
    <>
      <Card
        title={"Формирование результата"}
        width={"w-full"}
        shadow={"shadow-xl"}
      >
        <Form
          method={"post"}
          className={"flex flex-col gap-4"}
          encType={"multipart/form-data"}
        >
          <div>
            <div className="flex flex-col items-end gap-3 md:flex-row">
              <Select
                name={"userId"}
                title={"Выберите слушателя"}
                actionData={{
                  value: actionData?.fields?.userId,
                  fieldError: actionData?.fieldErrors?.userId,
                }}
                options={users}
                onChange={handleUserSelect}
              />{" "}
              <Link
                to={"/dashboard/listeners/create"}
                className={"btn-ghost btn"}
              >
                Создать слушателя
              </Link>
            </div>
            <div className="divider"></div>
            <Select
              name={"courseId"}
              title={"Выберите курс"}
              actionData={{
                value: actionData?.fields?.value,
                fieldError: actionData?.fieldErrors?.courseId,
              }}
              options={courses}
              onChange={handleCourseSelect}
            />
          </div>
          <FormControl
            actionData={{
              value: actionData?.fields?.score,
              fieldError: actionData?.fieldErrors?.score,
            }}
            title={"Бал"}
            placeholder={"Введите число"}
            type={"number"}
            name={"score"}
          />
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Выберите изображение</span>
            </label>
            <input
              type="file"
              name={"paymentInfo"}
              className="file-input-bordered file-input w-full max-w-xs"
              accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
            />
          </div>
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
          {user !== null && course !== null ? (
            <button className="btn-primary btn-block btn" type={"submit"}>
              Сформировать
            </button>
          ) : (
            <button
              className="btn-primary btn-disabled btn-block btn"
              type={"submit"}
            >
              Сформировать
            </button>
          )}
        </Form>
      </Card>
    </>
  );
};

export default ResultAddPage;
