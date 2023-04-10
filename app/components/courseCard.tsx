import React from "react";
import Card from "~/components/card";
import { dateTimeToString } from "~/utils/dateTools";

type CourseCardProps = {
  course: any;
  children: JSX.Element;
  courseListenersLength: any;
};

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  courseListenersLength,
  children,
}) => {
  const assignedAt = dateTimeToString(course.assignedAt);
  dateTimeToString(course.endedAt);
  return (
    <Card title={course.title} width={`w-full`}>
      <div className="space-y-4 p-2">
        <ul className={"list-disc"}>
          <li>Название: {course.title}</li>
          <li>Минимальный бал: {course.minimumScore}</li>
          <li>Количество прошедших слушателей: {courseListenersLength}</li>
          <li>Создатель: {course.author}</li>
          <li>Создан: {assignedAt}</li>
        </ul>
      </div>
      {children}
    </Card>
  );
};

export default CourseCard;
