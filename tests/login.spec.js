// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login page', () => {
  /** @type {LoginPage} */
  let loginPage;

  // Runs before every test: open the login page fresh
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC01 - login page loads with all elements', async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.rememberMeCheckbox).toBeVisible();
    await expect(loginPage.signInButton).toBeEnabled();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signUpLink).toBeVisible();
  });

  test('TC02 - empty email and password show required errors', async () => {
    await loginPage.signInButton.click();

    await expect(loginPage.emailRequiredError).toBeVisible();
    await expect(loginPage.passwordRequiredError).toBeVisible();
  });

  test('TC03 - invalid email format shows validation error', async () => {
    await loginPage.login('notanemail', 'SomePassword1');

    await expect(loginPage.emailFormatError).toBeVisible();
  });

  test('TC04 - unregistered email shows error message', async ({ page }) => {
    await loginPage.login('no.such.user.qa@example.com', 'WrongPass123!');

    await expect(loginPage.errorMessage).toContainText("couldn’t find an account");
    await expect(page).toHaveURL(/customer\/account\/login/);
  });

  test('TC05 - valid credentials log the user in', async ({ page }) => {
    const email = process.env.SAFCO_EMAIL;
    const password = process.env.SAFCO_PASSWORD;
    test.skip(!email || !password, 'Set SAFCO_EMAIL and SAFCO_PASSWORD in .env');

    await loginPage.login(/** @type {string} */ (email), /** @type {string} */ (password));

    // After login, Magento leaves the login URL
    await expect(page).not.toHaveURL(/customer\/account\/login/, { timeout: 20000 });
    await expect(loginPage.errorMessage).toBeHidden();
  });
});
