import React from "react";
import { Form, Link } from "@remix-run/react";
import Card from "~/components/card";

interface UserCardProps {
  data: {
    id: string;
    avatar: string | null;
    firstName: string;
    lastName: string;
    surName: string;
    phoneNumber: string;
    workPlace: string;
    email: string;
    role: string;
  };
}
const UserCard = ({ data }: UserCardProps) => {
  return (
    <>
      <Card title={""}>
        <div className="flex flex-col items-center">
          <h2 className="card-title">
            {data.firstName} {data.lastName} {data.surName}
          </h2>
          <p>{data.role === "USER" ? "Слушатель" : "Админ"}</p>
          <div className="divider"></div>
          <div className={"w-full"}>
            <div className="flex justify-between">
              <span>Email</span>
              <span>{data.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Место работы</span>
              <span>{data.workPlace}</span>
            </div>
            <div className="flex justify-between">
              <span>Номер телефона</span>
              <span>{data.phoneNumber}</span>
            </div>
          </div>
          <div className="divider"></div>
          <div className={"flex w-full flex-col gap-2"}>
            <Link to={"edit"} className={"btn-primary btn"}>
              Изменить
            </Link>
            <Form method={"post"} action={"delete"}>
              <input type="hidden" name={"userId"} value={data.id} />
              <button type={"submit"} className={"btn-error btn-block btn"}>
                Удалить
              </button>
            </Form>
          </div>
        </div>
      </Card>
    </>
  );
};

export default UserCard;
