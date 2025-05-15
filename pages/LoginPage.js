// Import Playwright's expect for assertions
import { expect } from '@playwright/test';

export class LoginPage {
  // Method to define page elements
  elements(page) {
    return {
      usernameInput: page.locator('[data-test="username"]'),
      passwordInput: page.locator('[data-test="password"]'),
      loginButton: page.locator('[data-test="login-button"]'),
    };
  }

  // Method to navigate to the login page
  async navigateToLoginPage(page) {
    const { baseUrl } = require('../config.js').configData;
    await page.goto(baseUrl);
  }

  // Method to perform login with configured credentials
  async login(page) {
    const { username, password } = require('../config.js').configData;
    await this.elements(page).usernameInput.fill(username);
    await this.elements(page).passwordInput.fill(password);
    await this.elements(page).loginButton.click();
  }

  // Method to click the login button
  async loginClick(page) {
    await this.elements(page).loginButton.click({ timeout: 15000 });
  }

  // Method to verify username is required error message
  async verifyErrorMessageUsernameRequired(page) {
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username is required');
  }

  // Method to login with invalid credentials
  async loginWithInvalidCredentials(page, username, password) {
    await this.elements(page).usernameInput.fill(username);
    await this.elements(page).passwordInput.fill(password);
    await this.elements(page).loginButton.click();
  }

  // Method to verify general error message
  async verifyErrorMessage(page) {
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
  }
}
