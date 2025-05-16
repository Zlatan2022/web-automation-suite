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

//sort.steps.js

When('User selects price \\(low to high\\) sort option', async function () {
  await this.inventoryPage.selectSortOption(this.page, 'lohi');
});

Then('User should see sort container is visible', async function () {
  await this.inventoryPage.verifySortContainerVisible(this.page);
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

//invalidLogin.steps.js

When('User logs in with invalid credentials', async function (dataTable) {
  const credentials = dataTable.rowsHash();
  await this.loginPage.loginWithInvalidCredentials(this.page, credentials['Username'], credentials['Password']);
});

Then('User should see error message', async function () {
  await this.loginPage.verifyErrorMessage(this.page);
});

//emptyLogin.steps.js

When('User leaves username and password empty and clicks login button', async function () {
  await this.loginPage.loginClick(this.page);
});

Then('User should see error message for empty username and password', async function () {
  await this.loginPage.verifyErrorMessageUsernameRequired(this.page);
});
