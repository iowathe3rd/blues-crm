import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import printCertificate from "~/utils/printCertificate.server";

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const origin = process.env.BASE_PATH;
  const pdf = await printCertificate(
    `${origin}/certificate/${params.certificateId}`
  );
  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
