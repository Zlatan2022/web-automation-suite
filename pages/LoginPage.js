import { expect } from '@playwright/test';

export class LoginPage {
  elements(page) {
    return {
      usernameInput: page.locator('[data-test="username"]'),
      passwordInput: page.locator('[data-test="password"]'),
      loginButton: page.locator('[data-test="login-button"]')
    };
  }

  async navigateToLoginPage(page) {
    const { baseUrl } = require('../config.js').configData;
    await page.goto(baseUrl);
  }

  async login(page) {
    const { username, password } = require('../config.js').configData;
    await this.elements(page).usernameInput.fill(username);
    await this.elements(page).passwordInput.fill(password);
    await this.elements(page).loginButton.click();
  }
}
