import { expect } from '@playwright/test';

export class LoginPage {
  elements(page) {
    return {
      usernameInput: page.locator('[data-test="username"]'),
      passwordInput: page.locator('[data-test="password"]'),
      loginButton: page.locator('[data-test="login-button"]'),
      errorMessage: page.locator('[data-test="error"]')
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

  async loginWithInvalidCredentials(page, username, password) {
    await this.elements(page).usernameInput.fill(username);
    await this.elements(page).passwordInput.fill(password);
    await this.elements(page).loginButton.click();
  }

  async verifyErrorMessage(page) {
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
  }
}
