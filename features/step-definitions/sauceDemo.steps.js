import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';



Given('User navigates to the Sauce Demo homepage', async function () {
    await this.loginPage.navigateToLoginPage(this.page);
});

When('User logs in with valid credentials', async function () {
    await this.loginPage.login(this.page,
        process.env.LOGIN_USERNAME,
        process.env.LOGIN_PASSWORD);
});

When('User adds Sauce Labs Fleece Jacket to cart', async function () {
    await this.inventoryPage.addToCart(this.page);
});

When('User navigates to cart', async function () {
    await this.inventoryPage.navigateToCart(this.page);
});

Then('User should see the product in cart', async function () {
    await this.cartPage.verifyProductInCart(this.page);
});

When('User clicks checkout', async function () {
    await this.cartPage.clickCheckout(this.page);
});

When('User fills out checkout form with the following details:', async function (dataTable) {
    const formData = dataTable.rowsHash();
    await this.checkoutPage.fillCheckoutForm(this.page, {
        firstName: formData['First Name'],
        lastName: formData['Last Name'],
        postalCode: formData['Postal Code']
    });
});

When('User clicks continue', async function () {
    await this.checkoutPage.clickContinue(this.page);
});

When('User clicks finish', async function () {
    await this.checkoutPage.clickFinish(this.page);
});

Then('User should see order confirmation', async function () {
    await this.checkoutPage.verifyOrderConfirmation(this.page);
});

//logout.steps.js

When('User clicks on Open Menu button', async function () {
    await this.logoutPage.clickOpenMenu(this.page);
});

When('User clicks on Logout link', async function () {
    await this.logoutPage.clickLogout(this.page);
});

Then('User should see login button', async function () {
    await this.logoutPage.verifyLoginButton(this.page);
});