import { Browser, BrowserContext, chromium, expect, Page, test } from '@playwright/test';
import { ExcelUtil } from '../utilities/ExcelUtil.ts';
import LoginPage from '../pages/LoginPage.ts';

let loginPageObj: LoginPage;
let excelUtil: ExcelUtil;

let excelFilePath: string;
let sheetName: string;
let page: Page;
let browser: Browser;
let context: BrowserContext;
let excelDataMap: Record<string, string>;

excelFilePath = 'SauceDemoData.xlsx';
sheetName = 'Login Page Content';
excelDataMap = {};

test.describe('Login Page', () => {
    test.beforeAll(async ({ browser }, testInfo) => {
      excelUtil = new ExcelUtil();
      const data = await excelUtil.readExcel(excelFilePath, sheetName);
      data.forEach((row: { Attribute: string; Value: string }) => {
        excelDataMap[row.Attribute.trim()] = row.Value.trim();
      });
  
      context = await browser.newContext();
      page = await context.newPage();
      loginPageObj = new LoginPage(page);
    });
  
    test.afterAll(async () => {
      await context.close();
    });
  
    test.only('TC1 - Check the content in login page', async ({}, testInfo) => {
      console.log(`Running test for: ${testInfo.project.name}`);
  
      await loginPageObj.gotoLoginPage();
  
      // Common assertions
      await expect(page).toHaveURL('https://www.saucedemo.com/');
  
      // Conditional assertions based on project name
      if (testInfo.project.name.includes('Mobile')) {
        await expect.soft(loginPageObj.logoText).toHaveText(excelDataMap['Page Title Mobile']);
        // Add more mobile-specific assertions here
      } else {
        await expect.soft(loginPageObj.logoText).toHaveText(excelDataMap['Page Title']);
        await expect.soft(loginPageObj.usernameInput).toHaveAttribute('placeholder', excelDataMap['User Name Placeholder']);
        await expect.soft(loginPageObj.passwordInput).toHaveAttribute('placeholder', excelDataMap['Password Placeholder']);
      }
    });
  });