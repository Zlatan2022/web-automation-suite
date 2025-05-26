import { expect } from '@playwright/test';

//test

export class CartPage {
  elements(page) {
    return {
      checkoutButton: page.locator('[data-test="checkout"]'),
      productInCart: page.locator('[data-test="item-5-title-link"]')
    };
  }

  async clickCheckout(page) {
    await this.elements(page).checkoutButton.click();
  }

  async verifyProductInCart(page) {
    await expect(this.elements(page).productInCart).toBeVisible();
  }
}