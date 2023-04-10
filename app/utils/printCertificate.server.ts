import puppeteer from "puppeteer";

export default async function printCertificate(path: string) {
  const options = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: "/usr/bin/chromium-browser",
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const pdf = await page.pdf({
    format: "A4",
    width: "1200px",
    height: "900px",
    scale: 0.7,
  });
  await browser.close();
  return pdf;
}
