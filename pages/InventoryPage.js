import { expect } from '@playwright/test';

export class InventoryPage {
  elements(page) {
    return {
      addToCartButton: page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]'),
      cartLink: page.locator('[data-test="shopping-cart-link"]'),
      productInCart: page.locator('[data-test="item-5-title-link"]'),
      sortContainer: page.locator('[data-test="product-sort-container"]')
    };
  }

  async selectSortOption(page, optionValue) {
    await this.elements(page).sortContainer.selectOption(optionValue);
  }

  async verifySortContainerVisible(page) {
    await expect(this.elements(page).sortContainer).toBeVisible();
  }

  async addToCart(page) {
    await this.elements(page).addToCartButton.click();
  }

  async navigateToCart(page) {
    await this.elements(page).cartLink.click();
  }

  async verifyProductInCart(page) {
    await expect(this.elements(page).productInCart).toBeVisible();
  }
}
