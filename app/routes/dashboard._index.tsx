import React from "react";
import { links } from "~/components/drawerSide";
import { Link } from "@remix-run/react";

const DashboardIndex = () => {
  return (
    <div>
      <div className={"grid grid-cols-1 gap-4 md:grid-cols-2"}>
        {links.map((link) => {
          return (
            <div
              key={link.id}
              className="card image-full w-full bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title">{link.title}</h2>
                <p>Перейти к созданию/редактированию {link.title}</p>
                <div className="card-actions justify-end">
                  <Link to={link.path} className="btn-primary btn">
                    Перейти
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardIndex;
