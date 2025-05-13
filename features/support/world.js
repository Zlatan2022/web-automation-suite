import { chromium } from '@playwright/test';
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
    this.browser = await chromium.launch({
      headless: false,
      // slowMo: 1000, // Add 1000ms delay between actions (adjust as needed)
      args: [
        '--no-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
      ],
    });
  }

  async initContext() {
    this.context = await this.browser.newContext({
      baseURL: BASE_URL || 'http://localhost:3000', // Default to localhost
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      permissions: ['clipboard-read', 'clipboard-write'],
      navigationTimeout: parseInt(NAVIGATION_TIMEOUT, 10) || 60000, // Default 60s
      actionTimeout: parseInt(ACTION_TIMEOUT, 10) || 30000, // Default 30s
    });
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
