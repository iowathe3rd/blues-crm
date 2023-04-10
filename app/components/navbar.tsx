import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar flex justify-end bg-base-300">
      <div className="">
        <form action="/logout" method="post">
          <button type="submit" className="btn-ghost btn">
            Выйти
          </button>
        </form>
        <label
          htmlFor="my-drawer-2"
          className="btn-ghost drawer-button btn lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
      </div>
    </div>
  );
};

export default Navbar;
