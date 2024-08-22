import { chromium } from "playwright";

const savePaths = {
  newGame: "./.auth/storage_blank.json",
  continueGame: "./.auth/storage_continue.json",
};

let products: Array<string> = [];

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  storageState: savePaths.continueGame,
  viewport: { width: 1280, height: 1080 },
});

const page = await context.newPage();

await page.goto("https://orteil.dashnet.org/cookieclicker/");

let lastSaveMs = Date.now();
let lastPurchaseMs = Date.now();

while (true) {
  if (lastSaveMs + 10000 < Date.now()) {
    await page.press("body", "Control+s");
    await context.storageState({ path: savePaths.continueGame });
    lastSaveMs = Date.now();
  }

  const availableUpgrades = await page.locator("button.upgrade.enabled").all();
  if (availableUpgrades.length !== 0) {
    await availableUpgrades[availableUpgrades.length - 1].click();
  }

  if (lastPurchaseMs + 30000 < Date.now()) {
    const ownedProductsLocator = page.locator(
      `[class = 'product unlocked enabled'][id *='product'] [class='title owned']`
    );
    products = await ownedProductsLocator.allTextContents();

    for (let i = 0; i < products.length; i++) {
      const productOwned = parseInt(products[i]);
      if (productOwned < 10) {
        const availableProducts = await page
          .locator("[class = 'product unlocked enabled'][id *='product']")
          .all();
        if (availableProducts.length !== 0) {
          await availableProducts[i].click();
        }
      }
    }
  }

  await page.locator("button#bigCookie").click();
}
