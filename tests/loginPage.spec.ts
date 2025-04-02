import {expect, test} from '@playwright/test';

test.describe('Login Page', async () => {
    test('should log in with valid credentials', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('.login_logo')).toHaveText('Swag Labs');
        
    })
})