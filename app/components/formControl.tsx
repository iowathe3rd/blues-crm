import React from "react";

export type FormControlProps = {
  actionData: {
    fieldError: string;
    value: string;
  };
  title: string;
  placeholder: string;
  type: string;
  name: string;
};

export const FormControl: React.FC<FormControlProps> = ({
  actionData,
  title,
  placeholder,
  type,
  name,
}) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{title}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className="input-bordered input"
        defaultValue={actionData.value}
        aria-invalid={Boolean(actionData?.fieldError)}
        aria-errormessage={
          actionData?.fieldError ? "password-error" : undefined
        }
      />
      <label className="label">
        <span className="label-text-alt text-sm text-red-600">
          {actionData?.fieldError ? actionData.fieldError : null}
        </span>
      </label>
    </div>
  );
};
