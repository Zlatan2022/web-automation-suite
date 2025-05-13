Feature: Sauce Demo Login and Checkout

Background:
    Given User navigates to the Sauce Demo homepage
    When User logs in with valid credentials

  @sauceDemo
  Scenario: User logs in, adds product to cart, and checks out
    # Given User navigates to the Sauce Demo homepage
    # When User logs in with valid credentials
    And User adds Sauce Labs Fleece Jacket to cart
    And User navigates to cart
    Then User should see the product in cart
    When User clicks checkout
    And User fills out checkout form with the following details:
      | Field       | Value |
      | First Name  | Zoki  |
      | Last Name   | Zvam  |
      | Postal Code | 0891  |
    When User clicks continue
    And User clicks finish
    Then User should see order confirmation

  @logout
  Scenario: User logs out successfully
    # Given User navigates to the Sauce Demo homepage
    When User clicks on Open Menu button
    And User clicks on Logout link
    Then User should see login button