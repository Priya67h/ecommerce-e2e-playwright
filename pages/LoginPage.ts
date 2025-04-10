import { Page, Locator } from '@playwright/test';

export default class LoginPage {
    readonly page: Page;
    readonly logoText: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoText = page.locator('.login_logo');
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
    }

    async gotoLoginPage() {
        await this.page.goto('/');
    }
}