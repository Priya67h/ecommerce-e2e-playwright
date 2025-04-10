import { Browser, BrowserContext, chromium, expect, Page, test } from '@playwright/test';
import { ExcelUtil } from '../../utilities/ExcelUtil.ts';
import LoginPage from '../../pages/LoginPage.ts';
import excelTestData from '../../excelDetails.json';

let loginPageObj: LoginPage;
let excelUtil: ExcelUtil;

let excelFilePath: string;
let sheetName: string;
let page: Page;
let browser: Browser;
let context: BrowserContext;
let excelDataMap: Record<string, string>;

excelFilePath = excelTestData.LoginPage.ExcelWorkBook;
sheetName = excelTestData.LoginPage.ExcelWorkSheet;
excelDataMap = {};

test.describe('Login Page', () => {

  test.beforeAll("Read the excel File", async () => {
    excelUtil = new ExcelUtil();
    const data = await excelUtil.readExcel(excelFilePath, sheetName);
    data.forEach((row: { Attribute: string; Value: string }) => {
      excelDataMap[row.Attribute.trim()] = row.Value.trim();
    });
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    loginPageObj = new LoginPage(page);
  })

  test.afterAll(async () => {
    await browser.close();
  });

  test('TC1 - Check the content in login page', async () => {
    await loginPageObj.gotoLoginPage();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect.soft(loginPageObj.logoText).toHaveText(excelDataMap['Page Title']);
    await expect.soft(loginPageObj.usernameInput).toHaveAttribute('placeholder', excelDataMap['User Name Placeholder']);
    await expect.soft(loginPageObj.passwordInput).toHaveAttribute('placeholder', excelDataMap['Password Placeholder']);
  });

  // test.only('TC2 - Check the content in login page', async ({}, testInfo) => {
  //   console.log(`Running test for: ${testInfo.project.name}`);
  // })

})