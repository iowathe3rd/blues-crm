import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { prisma } from "~/db.server";
import { supabase } from "~/utils/supabase.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);
  const form = await request.formData();
  const id = form.get("courseId") as string;
  const files = await prisma.listenersOnCourse.findMany({
    where: {
      courseId: id,
    },
    select: {
      paymentInfo: true,
    },
  });
  if (files.length > 0) {
    const paths = files.map((file) => {
      return file.paymentInfo;
    });
    // @ts-ignore
    const { error } = await supabase.storage.from("main").remove(paths);
    if (error) throw error;
  }
  return await prisma.course.delete({
    where: {
      id,
    },
  });
};

export const loader: LoaderFunction = async () => {
  return redirect("/dashboard/courses");
};
