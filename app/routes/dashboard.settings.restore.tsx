import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { setDefaultSettings } from "~/models/settings.server";

export const loader: LoaderFunction = async () => {
  await setDefaultSettings();
  return redirect("/dashboard/settings");
};
