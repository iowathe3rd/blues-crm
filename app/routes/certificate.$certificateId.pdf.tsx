import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import printCertificate from "~/utils/printCertificate.server";

export const loader: LoaderFunction = async ({ params }: LoaderArgs) => {
  const origin = new URL(process.env.HOME_URL as string);
  const url = new URL(`certificate/${params.certificateId}`, origin).toString();
  const pdf = await printCertificate(url);
  return new Response(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
};
