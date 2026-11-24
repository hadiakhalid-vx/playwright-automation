// @ts-check
import { expect } from '@playwright/test';

/**
 * Page Object for the customer login page.
 * Keeps all locators and actions for this page in one place,
 * so tests stay short and only one file changes if the UI changes.
 */
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = '/customer/account/login/';

    // Locators
    this.heading = page.getByRole('heading', { name: 'Log in to your account' });
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#pass');
    this.rememberMeCheckbox = page.locator('input[name="persistent_remember_me"]');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.signUpLink = page.getByRole('link', { name: 'Sign up' });
    this.errorMessage = page.locator('.message.error');

    // Field validation messages
    this.emailRequiredError = page.getByText('Please enter your email');
    this.passwordRequiredError = page.getByText('Please enter your password');
    this.emailFormatError = page.getByText('Email is not correct');
  }

  async goto() {
    await this.page.goto(this.url);
    await expect(this.heading).toBeVisible();
  }

  /**
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
