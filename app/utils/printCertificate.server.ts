import type { PuppeteerLaunchOptions } from "puppeteer";
import puppeteer from "puppeteer";

export default async function printCertificate(path: string) {
  const options: PuppeteerLaunchOptions = {
    headless: true,
    timeout: 0,
    ignoreHTTPSErrors: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/chromium-browser",
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(path, { waitUntil: "domcontentloaded", timeout: 0 });
  const pdf = await page.pdf({
    format: "A4",
    width: "1200px",
    height: "900px",
    scale: 0.7,
  });
  await browser.close();
  return pdf;
}
