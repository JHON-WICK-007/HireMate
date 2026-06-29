import puppeteer, { Browser } from "puppeteer";

let browserInstance: Browser | null = null;

/**
 * Returns the active shared Puppeteer browser instance.
 * If the instance doesn't exist or has been disconnected, it launches a new one.
 */
export async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.connected) {
    console.log("Launching new shared Puppeteer browser instance...");
    browserInstance = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }
  return browserInstance;
}

/**
 * Closes the shared browser instance if active.
 */
export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

/**
 * Compiles an HTML string into an A4 PDF Buffer using the shared browser.
 * Uses a new isolated page per request and closes it after compilation.
 */
export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Set viewport matching standard desktop rendering
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    // Inject HTML content
    await page.setContent(html, {
      waitUntil: "networkidle0" as any,
    });

    // Generate standard margin-free A4 PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        bottom: "0mm",
        left: "0mm",
        right: "0mm",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}
