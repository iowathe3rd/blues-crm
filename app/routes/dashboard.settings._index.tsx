import React, { useState } from "react";
import type {
  ActionArgs,
  ActionFunction,
  LoaderFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { badRequest } from "~/utils/request.server";
import { SwatchesPicker } from "react-color";

import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import EmptyLayout from "~/layouts/emptyLayout";

import { redis } from "~/utils/redis.server";
import { validateString } from "~/utils/validate.server";
import Spinner from "~/components/spinner";
import Card from "~/components/card";
import ToolBar from "~/components/toolbar";
import { FormControl } from "~/components/formControl";
import Select from "~/components/select";
import {
  getCertificateSettings,
  setDefaultSettings,
} from "~/models/settings.server";

export const loader: LoaderFunction = async () => {
  let settings = await redis.get("certificateSettings");
  if (!settings) {
    await setDefaultSettings();
    // @ts-ignore
    settings = await getCertificateSettings();
    return json({ settings });
  }
  settings = JSON.parse(settings);
  return json({ settings });
};

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const form = await request.formData();
  const certificateBackground = form.get("certificateBackground");
  const defaultFont = form.get("font");
  const primaryTextColor = form.get("primaryTextColor");
  const secondaryTextColor = form.get("secondaryTextColor");
  const fields = {
    certificateBackground,
    defaultFont: defaultFont,
    primaryTextColor,
    secondaryTextColor,
  };
  try {
    //Начальная валидация
    if (
      typeof certificateBackground !== "string" ||
      typeof defaultFont !== "string" ||
      typeof primaryTextColor !== "string" ||
      typeof secondaryTextColor !== "string"
    ) {
      //Отправка ответа с ошибками
      return badRequest({
        fields: null,
        formError: `Форма была заполнена неверно`,
      });
    }
    const fieldErrors = {
      certificateBackground: validateString(certificateBackground),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
      return badRequest({
        fieldErrors,
        fields,
        formError: null,
      });
    }
    const settings = {
      certificate: {
        certificateBackground,
        defaultFont,
        primaryTextColor,
        secondaryTextColor,
      },
    };
    await redis.set("certificateSettings", JSON.stringify(settings));
    return json(fields);
  } catch (e) {
    console.log(e);
    return badRequest({
      fields: null,
      formError: `Форма была заполнена неверно`,
    });
  }
};

const CertificateSettings = () => {
  const [defaultColor, setDefaultColor] = useState<string>("#000000");
  const [secondaryColor, setSecondaryColor] = useState<string>("#000000");
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData();
  function handleFontSelect(value: string) {
    console.log(value);
  }
  const fontOptions = [
    { id: 0, value: "serif", title: "serif" },
    { id: 1, value: "sans-serif", title: "sans-serif" },
    { id: 2, value: "monospace", title: "monospace" },
    { id: 3, value: "cursive", title: "cursive" },
    { id: 4, value: "fantasy", title: "fantasy" },
    { id: 5, value: "system-ui", title: "system-ui" },
    { id: 6, value: "ui-serif", title: "ui-serif" },
    { id: 7, value: "ui-sans-serif", title: "ui-sans-serif" },
    { id: 8, value: "ui-monospace", title: "ui-monospace" },
    { id: 9, value: "ui-rounded", title: "ui-rounded" },
    { id: 10, value: "emoji", title: "emoji" },
    { id: 11, value: "math", title: "math" },
  ];
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

  const toolbarItems = [
    { label: "Сертификат", icon: null, linkPath: "certificate" },
  ];

  return (
    <div>
      <ToolBar items={toolbarItems} />
      <div className={"flex justify-center"}>
        <Card
          title={"Изменить настройки"}
          width={"max-w-full"}
          linkTitle={"Сбросить настройки"}
          linkPath={"restore"}
        >
          <Form method={"post"}>
            <FormControl
              actionData={{
                value:
                  actionData?.fields?.certificateBackground ??
                  settings.certificateBackground,
                fieldError: actionData?.fieldErrors?.certificateBackground,
              }}
              title={"Фон сертификата (1200/804 пикселя!)"}
              placeholder={"Ссылка на картинку"}
              type={"text"}
              name={"certificateBackground"}
            />
            <Select
              description={"Выберите шрифт"}
              name={"font"}
              title={"Шрифт"}
              actionData={actionData}
              options={fontOptions}
              onChange={handleFontSelect}
            />
            <input
              type="hidden"
              name={"primaryTextColor"}
              value={defaultColor}
            />
            <input
              type="hidden"
              name={"secondaryTextColor"}
              value={secondaryColor}
            />

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2
                    className="card-title"
                    style={{ color: `${defaultColor}` }}
                  >
                    Выберите основной цвет текста
                  </h2>
                  <SwatchesPicker
                    onChange={(color) => {
                      setDefaultColor(color.hex);
                    }}
                    color={defaultColor}
                  />
                </div>
              </div>
              <div className="card w-full bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2
                    className="card-title flex flex-row"
                    style={{ color: `${secondaryColor}` }}
                  >
                    Выберите вторичный цвет текста
                  </h2>
                  <SwatchesPicker
                    onChange={(color) => {
                      setSecondaryColor(color.hex);
                      console.log(color.hex);
                    }}
                    color={secondaryColor}
                  />
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default CertificateSettings;
