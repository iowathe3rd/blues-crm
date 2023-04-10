import { redis } from "~/utils/redis.server";

const defaultSettings = {
  certificate: {
    certificateBackground: "/assets/certificate-background.jpg",
    defaultFont: "serif",
    primaryTextColor: "#000000",
    secondaryTextColor: "#0d47a1",
  },
};
export const setDefaultSettings = async () => {
  await redis.set("certificateSettings", JSON.stringify(defaultSettings));
};

export const getCertificateSettings = async () => {
  const settings = await redis.get("certificateSettings");
  if (!settings) await setDefaultSettings();
  // @ts-ignore
  return JSON.parse(await redis.get("certificateSettings"));
};
