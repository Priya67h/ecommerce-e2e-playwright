import { Page, Locator } from '@playwright/test';

export default class LoginPage {
    readonly page: Page;
    readonly logoText: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.logoText = page.locator('.login_logo');
        this.usernameInput = page.locator('#user-name');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login-button');
        this.errorMessage = page.locator('.error-message-container');
    }

    async gotoLoginPage() {
        await this.page.goto('/');
    }

    async clickLoginButton(){
        await this.loginButton.click();
    }
}