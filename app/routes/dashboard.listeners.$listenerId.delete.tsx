import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { supabase } from "~/utils/supabase.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  const form = await request.formData();
  const id = form.get("userId") as string;

  const files = await prisma.listenersOnCourse.findMany({
    where: {
      listenerId: id,
    },
    select: {
      paymentInfo: true,
    },
  });
  const paths = files.map((file) => file.paymentInfo);
  if (paths.length != 0) {
    const { error } = await supabase.storage.from("main").remove(paths);
    if (error) throw error;
  }
  await prisma.user.delete({
    where: {
      id,
    },
  });
  return null;
};

export const loader: LoaderFunction = async () => {
  return redirect("/dashboard/listeners");
};
