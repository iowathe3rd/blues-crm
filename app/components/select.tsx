import type { SetStateAction } from "react";
import React from "react";

type SelectProps = {
  name: string;
  title: string;
  actionData: {
    fieldError: string;
    value: string;
  };
  options: {
    id: string | number;
    value: string;
    title: string;
  }[];
  onChange: React.Dispatch<SetStateAction<any>>;
  description?: string;
};

const Select: React.FC<SelectProps> = ({
  description,
  name,
  title,
  options,
  actionData,
  onChange,
}) => {
  return (
    <div className="form-control w-full w-full">
      <label className="label">
        <span className="label-text">{description}</span>
      </label>
      <select
        onChange={(event) => onChange(event.target.value)}
        name={name}
        className="select-bordered select"
        aria-invalid={Boolean(actionData?.fieldError)}
        aria-errormessage={actionData?.fieldError ? "" : undefined}
      >
        <option disabled selected>
          {title}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
