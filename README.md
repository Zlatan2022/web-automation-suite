# Shop E2E Test Automation Framework

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Framework Components](#framework-components)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Prerequisites
```bash
Node.js (v14 or higher)
npm (v6 or higher)
```

## Project Structure
```
project-root/
├── config/
│   └── PageConfig.js
├── pages/
│   ├── LoginPage.js
│   └── HomePage.js
├── utils/
│   └── CommonActions.js
├── features/
│   ├── login.feature
│   └── steps/
│       └── login.steps.js
├── cucumber.js
└── package.json
```

## Installation

1. Create a new project:
```bash
mkdir test-automation
cd test-automation
npm init -y
```

2. Install required dependencies:
```bash
npm install @cucumber/cucumber playwright @playwright/test
```

3. Add scripts to package.json:
```json
{
  "scripts": {
    "test": "cucumber-js",
    "test:headed": "cucumber-js --world-parameters \"{\\\"headless\\\": false}\"",
    "report": "node report-generator.js"
  }
}
```

## Framework Components

### 1. Page Configuration (config/PageConfig.js)
```javascript
export const Config = {
    timeout: 30000,
    baseUrl: process.env.BASE_URL || 'https://your-website.com',
    selectors: {
        login: {
            usernameInput: '#username',
            passwordInput: '#password',
            loginButton: '#login-btn'
        },
        home: {
            dashboard: '.dashboard',
            userProfile: '#user-profile'
        }
    }
};
```

### 2. Common Actions (utils/CommonActions.js)
```javascript
export const CommonActions = {
    async waitForLoad(page) {
        await page.waitForLoadState('networkidle');
    },
    
    async clickAndWait(page, selector) {
        await page.click(selector);
        await this.waitForLoad(page);
    }
};
```

### 3. Page Objects

#### LoginPage (pages/LoginPage.js)
```javascript
import { Config } from '../config/PageConfig';
import { CommonActions } from '../utils/CommonActions';

export const LoginPage = {
    async navigate(page) {
        await page.goto(`${Config.baseUrl}/login`);
        await CommonActions.waitForLoad(page);
    },

    async login(page, username, password) {
        const { usernameInput, passwordInput, loginButton } = Config.selectors.login;
        await page.fill(usernameInput, username);
        await page.fill(passwordInput, password);
        await CommonActions.clickAndWait(page, loginButton);
    }
};
```

#### HomePage (pages/HomePage.js)
```javascript
import { Config } from '../config/PageConfig';
import { CommonActions } from '../utils/CommonActions';

export const HomePage = {
    async checkDashboard(page) {
        const { dashboard } = Config.selectors.home;
        await page.waitForSelector(dashboard);
    },

    async navigateToProfile(page) {
        const { userProfile } = Config.selectors.home;
        await CommonActions.clickAndWait(page, userProfile);
    }
};
```

## Usage Examples

### 1. Basic Login Test

#### Feature File (features/login.feature)
```gherkin
Feature: Login Functionality

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter valid credentials
    Then I should see the dashboard
```

#### Step Definitions (features/steps/login.steps.js)
```javascript
import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';

Given('I am on the login page', async function() {
    await LoginPage.navigate(this.page);
});

When('I enter valid credentials', async function() {
    await LoginPage.login(this.page, 'test@example.com', 'password123');
});

Then('I should see the dashboard', async function() {
    await HomePage.checkDashboard(this.page);
});
```

### 2. Complex User Journey

#### Feature File (features/user-journey.feature)
```gherkin
Feature: User Journey

  Scenario: User completes profile after login
    Given I am logged in
    When I navigate to profile page
    And I update my profile details
    Then the profile should be saved
```

#### Step Definitions
```javascript
import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';
import { ProfilePage } from '../../pages/ProfilePage';

Given('I am logged in', async function() {
    await LoginPage.navigate(this.page);
    await LoginPage.login(this.page, 'test@example.com', 'password123');
    await HomePage.checkDashboard(this.page);
});
```

## Best Practices

1. Page Organization:
   - Keep page actions focused and atomic
   - Use meaningful names for functions
   - Group related actions together

2. Error Handling:
```javascript
export const LoginPage = {
    async login(page, username, password) {
        try {
            await page.fill('#username', username);
            await page.fill('#password', password);
            await page.click('#login-btn');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
};
```

3. Configuration Management:
   - Use environment variables for sensitive data
   - Keep selectors in a central configuration
   - Use different configs for different environments

## Troubleshooting

Common Issues and Solutions:

1. Element Not Found
```javascript
// Add wait before interactions
await page.waitForSelector('#element', { state: 'visible' });
```

2. Timing Issues
```javascript
// Increase timeout for slow operations
await page.waitForSelector('#element', { timeout: 30000 });
```

3. Network Issues
```javascript
// Wait for network idle
await page.waitForLoadState('networkidle');
```

## Running Tests

1. Run all tests:
```bash
npm test
```

2. Run specific feature:
```bash
npm test features/login.feature
```

3. Run with UI (headed mode):
```bash
npm run test:headed
```

## Reporting

Test results are automatically generated in the reports directory. To generate a custom report:

```bash
npm run report
```

---

For more information or support, please contact the test automation team.
