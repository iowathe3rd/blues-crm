import type { V2_MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export const meta: V2_MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
        {user ? (
          <Link
            to="/dashboard"
            className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
          >
            Перейти к редактированию как {user.email}
          </Link>
        ) : (
          <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
            {/*<Link*/}
            {/*  to="/join"*/}
            {/*  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"*/}
            {/*>*/}
            {/*  Sign up*/}
            {/*</Link>*/}
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
            >
              Войти
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
