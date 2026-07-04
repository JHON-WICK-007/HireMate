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
      headless: "shell",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
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
    console.log("Closing shared Puppeteer browser instance...");
    await browserInstance.close();
    browserInstance = null;
  }
}

// Clean up Puppeteer instance on server shutdown to prevent orphaned chrome processes
process.on("SIGINT", async () => {
  await closeBrowser();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeBrowser();
  process.exit(0);
});


/**
 * Compiles an HTML string into an A4 PDF Buffer using the shared browser.
 * Uses a new isolated page per request and closes it after compilation.
 */
export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Emulate screen media so CSS matches the browser preview (not print media)
    await page.emulateMediaType("screen");

    // Set viewport matching the resume card dimensions (A4 at 96 DPI)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Inject HTML content — use 'load' for setContent (networkidle0 not supported here)
    await page.setContent(html, { waitUntil: "load" });

    // Wait for all @font-face declarations to finish loading
    await page.waitForFunction("document.fonts.ready.then(() => true)", { timeout: 10000 });

    // Brief pause to let CSS custom properties and layout settle
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Generate standard margin-free A4 PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
      preferCSSPageSize: false,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await page.close();
  }
}
