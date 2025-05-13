import { expect } from '@playwright/test';

export class LogoutPage {
  elements(page) {
    return {
      openMenuButton: page.getByRole('button', { name: 'Open Menu' }),
      logoutLink: page.locator('[data-test="logout-sidebar-link"]'),
      loginButton: page.locator('[data-test="login-button"]')
    };
  }

  async clickOpenMenu(page) {
    await this.elements(page).openMenuButton.click();
  }

  async clickLogout(page) {
    await this.elements(page).logoutLink.click();
  }

  async verifyLoginButton(page) {
    await expect(this.elements(page).loginButton).toBeVisible();
  }
}