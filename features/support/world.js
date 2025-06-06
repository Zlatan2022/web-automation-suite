import { chromium, firefox, webkit } from '@playwright/test';
import { setWorldConstructor, World } from '@cucumber/cucumber';
import {
  ACTION_TIMEOUT,
  NAVIGATION_TIMEOUT,
  BASE_URL,
  HEADLESS,
} from '../../config';
import { InventoryPage } from '../../pages/InventoryPage';
import { LoginPage } from '../../pages/LoginPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { CartPage } from '../../pages/CartPage';
import { LogoutPage } from '../../pages/LogoutPage'; // Import LogoutPage 

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.sharedData = {};
    this.debug = false;
    this.getIframeBySelector = this.getIframeBySelector.bind(this);

    // Add page objects
    this.inventoryPage = new InventoryPage();
    this.loginPage = new LoginPage();
    this.checkoutPage = new CheckoutPage();
    this.cartPage = new CartPage();
    this.logoutPage = new LogoutPage(); // Initialize LogoutPage
  }

  getIframeBySelector = async function (selector) {
    const iframeElement = await this.page.$(selector);
    if (!iframeElement) {
      throw new Error(`Iframe with selector "${selector}" not found`);
    }
    const iframe = await iframeElement.contentFrame();
    if (!iframe) {
      throw new Error(
        `Unable to switch to iframe context for selector "${selector}"`,
      );
    }
    return iframe;
  };

  async init() {
    await this.initBrowser();
    await this.initContext();

    this.page = await this.context.newPage();

    // Handle console messages
    this.page.on('console', (msg) => {
      const logMessage = `[${new Date().toISOString()}] [${msg.type().toUpperCase()}] ${msg.text()}`;
      if (msg.type() === 'error') {
        console.error('Page Console Error:', logMessage);
      } else {
        console.log(logMessage);
      }
    });

    // Handle uncaught page errors
    this.page.on('pageerror', (err) => {
      console.error(`[${new Date().toISOString()}] Page Error:`, err);
    });

    // Handle WebSocket errors
    this.page.on('websocket', (ws) => {
      ws.on('socketerror', (err) => {
        console.error(`[${new Date().toISOString()}] WebSocket Error:`, err);
      });
      ws.on('close', () => {
        console.log(`[${new Date().toISOString()}] WebSocket closed`);
      });
    });

    // Route handling
    await this.page.route('**/*socket.io/**', (route) => route.continue());
    await this.page.route('wss://pioneer.bit.country/**', (route) =>
      route.continue(),
    );
  }

  async initBrowser() {
    const browserName = process.env.BROWSER_NAME || 'chromium';
    const headlessEnv = process.env.HEADLESS;
    const headless = headlessEnv !== undefined ? headlessEnv.toLowerCase() === 'true' : true;

    console.log(`Launching browser: ${browserName} (headless: ${headless})`);

    let browserArgs = []; // Start with no specific args for Firefox/WebKit by default

    if (browserName === 'chromium') {
      browserArgs = [
        '--no-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ];
    }

    const launchOptions = {
      headless: headless,
      args: browserArgs,
    };

    if (browserName === 'firefox') {
      this.browser = await firefox.launch(launchOptions);
    } else if (browserName === 'webkit') {
      this.browser = await webkit.launch(launchOptions); // WebKit will now use empty args
    } else if (browserName === 'chromium') {
      this.browser = await chromium.launch(launchOptions);
    } else {
      console.warn(`Unsupported browser: ${browserName}. Defaulting to chromium.`);
      // For default (Chromium), ensure Chromium-specific args are present
      const defaultChromiumArgs = [
        '--no-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ];
      this.browser = await chromium.launch({ ...launchOptions, args: defaultChromiumArgs });
    }
  }

  async initContext() {
    const browserName = this.browser.browserType().name(); // Get current browser name
    let contextOptions = {
      baseURL: BASE_URL || 'http://localhost:3000', // Default to localhost
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      navigationTimeout: parseInt(NAVIGATION_TIMEOUT, 10) || 60000, // Default 60s
      actionTimeout: parseInt(ACTION_TIMEOUT, 10) || 30000, // Default 30s
    };

    // Only apply clipboard permissions for Chromium as they cause issues with Firefox/WebKit
    if (browserName === 'chromium') {
      contextOptions.permissions = ['clipboard-read', 'clipboard-write'];
    }

    this.context = await this.browser.newContext(contextOptions);
  }

  async cleanup() {
    try {
      if (this.page) {
        await this.page.close();
      }
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Cleanup Error:`, error);
    }
  }
}

setWorldConstructor(CustomWorld);
