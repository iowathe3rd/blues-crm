import React from "react";
import { Link } from "@remix-run/react";

export type CardProps = {
  title: string;
  width?: string;
  children: JSX.Element[] | JSX.Element;
  linkPath?: string;
  linkTitle?: string;
  shadow?: string;
};

const Card: React.FC<CardProps> = ({
  title,
  children,
  linkPath,
  linkTitle,
  width = "max-w-md",
  shadow = "shadow-xl",
}) => {

  return (
    <div className={`card ${width} w-full bg-base-100 ${shadow}`}>
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title">{title}</h2>
          {linkTitle && (
            <Link to={String(linkPath)} className={"btn-primary btn-sm btn"}>
              {linkTitle}
            </Link>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Card;
