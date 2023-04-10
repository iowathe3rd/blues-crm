import React from "react";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Link, useLoaderData } from "@remix-run/react";

import { dateTimeToString, timeStampToTimeDifference } from "~/utils/dateTools";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { supabase } from "~/utils/supabase.server";
import Card from "~/components/card";

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request);
  const courseResult = await prisma.listenersOnCourse.findUnique({
    where: {
      id: params.resultId,
    },
    select: {
      id: true,
      course: true,
      listener: true,
      score: true,
      paymentInfo: true,
      duration: true,
      finished: true,
      assignedAt: true,
    },
  });
  if (!courseResult) {
    return Error("Result not found");
  }
  const { data: paymentInfo } = supabase.storage
    .from("main")
    .getPublicUrl(courseResult.paymentInfo);
  return json({ courseResult, paymentInfo });
};

const ResultIndex: React.FC = () => {
  const { courseResult, paymentInfo } = useLoaderData();
  return (
    <div className={"grid grid-cols-1 gap-2 md:grid-cols-2"}>
      <Card title={"Результат прохождения"} width={`w-full`}>
        <div className={"flex flex-col"}>
          <span>
            {" "}
            <b>Учащийся</b> - {courseResult.listener.firstName}{" "}
            {courseResult.listener.lastName} {courseResult.listener.surName}
          </span>
          <span>
            {" "}
            <b>Процент</b> - {courseResult.score}%
          </span>
          <span>
            {" "}
            <b>Курс</b> - {courseResult.course.title}
          </span>
          <span>
            {" "}
            <b>Время прохождения</b> -{" "}
            {timeStampToTimeDifference(courseResult.duration.toString())}
          </span>
          <span>
            {" "}
            <b>Время старт</b> - {dateTimeToString(courseResult.assignedAt)}
          </span>
          <span>
            {" "}
            <b>Время конца</b> - {dateTimeToString(courseResult.finished)}
          </span>
        </div>
        <div className="divider mt-auto"></div>
        <Link to={"edit"} className={"btn-primary btn"}>
          Изменить
        </Link>
        <Link
          to={`/certificate/${courseResult.id}`}
          className={"btn-primary btn-block btn"}
        >
          Посмотреть сертификат
        </Link>
      </Card>
      <Card title={"Документ об оплате"} width={`w-full`}>
        <img src={paymentInfo.publicUrl} alt={"payment-info"} />
      </Card>
    </div>
  );
};

export default ResultIndex;
