import type { PuppeteerLaunchOptions } from "puppeteer";
import puppeteer from "puppeteer";

export default async function printCertificate(path: string) {
  const options: PuppeteerLaunchOptions = {
    headless: true,
    timeout: 0,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--autoplay-policy=user-gesture-required",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-breakpad",
      "--disable-client-side-phishing-detection",
      "--disable-component-update",
      "--disable-default-apps",
      "--disable-dev-shm-usage",
      "--disable-domain-reliability",
      "--disable-extensions",
      "--disable-features=AudioServiceOutOfProcess",
      "--disable-hang-monitor",
      "--disable-ipc-flooding-protection",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-popup-blocking",
      "--disable-print-preview",
      "--disable-prompt-on-repost",
      "--disable-renderer-backgrounding",
      "--disable-setuid-sandbox",
      "--disable-speech-api",
      "--disable-sync",
      "--hide-scrollbars",
      "--ignore-gpu-blacklist",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-default-browser-check",
      "--no-first-run",
      "--no-pings",
      "--no-sandbox",
      "--no-zygote",
      "--password-store=basic",
      "--use-gl=swiftshader",
      "--use-mock-keychain",
    ],
    executablePath: String(process.env.CHROME_BIN)
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.goto(path, { waitUntil: "networkidle2", timeout: 0 });
  await page.$eval("div.certificate-pdf-link", (element) => {
    return element.remove();
  });
  const pdf = await page.pdf({
    format: "A4",
    width: "1200px",
    height: "900px",
    scale: 0.7,
  });
  await browser.close();
  return pdf;
}
