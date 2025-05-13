import { expect } from '@playwright/test';

export class CheckoutPage {
  elements(page) {
    return {
      firstNameInput: page.locator('[data-test="firstName"]'),
      lastNameInput: page.locator('[data-test="lastName"]'),
      postalCodeInput: page.locator('[data-test="postalCode"]'),
      continueButton: page.locator('[data-test="continue"]'),
      finishButton: page.locator('[data-test="finish"]'),
      orderConfirmation: page.locator('[data-test="complete-header"]')
    };
  }

  async fillCheckoutForm(page, formData) {
    await this.elements(page).firstNameInput.fill(formData.firstName);
    await this.elements(page).lastNameInput.fill(formData.lastName);
    await this.elements(page).postalCodeInput.fill(formData.postalCode);
  }

  async clickContinue(page) {
    await this.elements(page).continueButton.click();
  }

  async clickFinish(page) {
    await this.elements(page).finishButton.click();
  }

  async verifyOrderConfirmation(page) {
    await expect(this.elements(page).orderConfirmation).toBeVisible();
  }
}