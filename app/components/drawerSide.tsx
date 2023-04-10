import React from "react";
import { NavLink } from "@remix-run/react";

export const links = [
  { id: 1, title: "Курсы", path: "courses" },
  { id: 2, title: "Слушатели", path: "listeners" },
  { id: 3, title: "Результаты", path: "results" },
  { id: 4, title: "Настройки", path: "settings" },
];

const DrawerSide: React.FC = () => {
  const btnClassName = "btn btn-block btn-ghost flex justify-start",
    btnActiveClassName = "btn btn-block flex justify-start btn-primary";

  return (
    <ul className="menu flex w-80 flex-col gap-2 bg-base-200 p-4 text-base-content">
      {links.map((link) => (
        <div key={link.id}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              isActive ? btnActiveClassName : btnClassName
            }
          >
            {link.title}
          </NavLink>
        </div>
      ))}
    </ul>
  );
};

export default DrawerSide;
