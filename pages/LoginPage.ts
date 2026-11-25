import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly operatorInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;
  readonly errorText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.operatorInput = page.getByLabel('Operator ID');
    this.passwordInput = page.getByLabel('Password');
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });
    this.errorText = page.locator('#login-error');
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async login(operatorId: string, password: string) {
    await this.operatorInput.fill(operatorId);
    await this.passwordInput.fill(password);
    await this.signInBtn.click();
  }

  async expectInvalidLoginError() {
    await expect(this.errorText).toHaveText('Invalid Operator Credentials');
  }
}
