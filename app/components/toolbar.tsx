import React from "react";
import { Link } from "@remix-run/react";

type ToolBarProps = {
  items: {
    label?: string;
    icon: JSX.Element | null;
    linkPath: string;
  }[];
};

const ToolBar: React.FC<ToolBarProps> = ({ items }) => {
  return (
    <>
      <div className="navbar mb-4 hidden justify-end gap-2 overflow-scroll overflow-x-scroll rounded-xl bg-base-200 md:flex">
        {items.map((item) => {
          return (
            <Link
              key={Math.random()}
              to={item.linkPath}
              className={"btn-primary btn"}
            >
              {item.icon}&nbsp;{item.label}
            </Link>
          );
        })}
      </div>
      <div className="justify-ыефке flex md:hidden">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            {items.map((item) => (
              <li key={item.label}>
                <Link to={item.linkPath}>
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ToolBar;
