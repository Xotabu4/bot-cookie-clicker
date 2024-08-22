import { chromium, devices } from "playwright";

// const authFile = '../.auth/user.json';
const authFile = "./.auth/storageStateBlank.json";

(async () => {
  // Setup
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: authFile,
    viewport: {
      width: 1280,
      height: 1080,
    },
  });
  const page = await context.newPage();
  process.on("SIGTERM", async () => {
    // Teardown
    await context.close();
    await browser.close();
  });

  await page.goto("https://orteil.dashnet.org/cookieclicker/");

  setInterval(async () => {
    await page.locator("button#bigCookie").dblclick({ force: true });
  }, 1);
})();
