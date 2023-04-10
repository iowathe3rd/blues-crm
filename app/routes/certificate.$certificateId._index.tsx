import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Link, Outlet, useLoaderData, useNavigation } from "@remix-run/react";

import EmptyLayout from "~/layouts/emptyLayout";

import { prisma } from "~/db.server";
import Spinner from "~/components/spinner";
import { getCertificateSettings } from "~/models/settings.server";
import Certificate from "~/components/certificate";

export const loader: LoaderFunction = async ({ params, request }) => {
  const isAdmin = true;
  const data = await prisma.listenersOnCourse.findUnique({
    where: {
      id: params.certificateId,
    },
    select: {
      id: true,
      listener: true,
      finished: true,
      course: {
        select: {
          title: true,
        },
      },
      certificateAvailable: true,
    },
  });
  const settings = await getCertificateSettings();
  if (!settings) return new Error("SETTiNGS NOt SEtTED");
  const { BASE_PATH } = process.env;
  return json({ settings, data, isAdmin, BASE_PATH });
};

const CertificateIndex = () => {
  const { settings, data, isAdmin, BASE_PATH } = useLoaderData<typeof loader>();
  console.log(settings);
  const { state } = useNavigation();
  if (state === "loading") {
    return (
      <EmptyLayout>
        <Spinner />
      </EmptyLayout>
    );
  }
  if (!data.certificateAvailable) {
    return (
      <EmptyLayout>
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Сертификата нет</h2>
            <p>
              Данные о прохождении сохранены но полученный балл ниже проходного
            </p>
            {isAdmin ? (
              <div className="card-actions justify-end">
                <Link className="btn-primary btn" to={"/dashboard"}>
                  На главную
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </EmptyLayout>
    );
  }
  return (
    <div>
      <div className={"flex flex-col items-center"}>
        <div className={"flex items-center justify-center gap-2"}>
          <Link to={"pdf"} className={"btn-primary btn"} reloadDocument>
            Посмотреть как pdf
          </Link>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
      <Certificate
        id={data.id}
        settings={settings.certificate}
        courseName={data.course.title}
        listenerData={data.listener}
        assignedAt={data.finished}
        basePath={BASE_PATH}
      />
    </div>
  );
};

export default CertificateIndex;
