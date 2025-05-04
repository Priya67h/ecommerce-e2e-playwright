import { BrowserContext, expect, Page, test } from '@playwright/test';
import { ExcelUtil } from '../utilities/ExcelUtil.ts';
import { CommonUtil } from '../utilities/CommonUtil.ts';
import LoginPage from '../pages/LoginPage.ts';

let loginPageObj: LoginPage;
let excelUtil: ExcelUtil;
let commonUtil: CommonUtil;

let excelFilePath: string;
let sheetName: string;
let sheetName1: string;
let page: Page;
let context: BrowserContext;
let loginPageContentMap: Record<string, string>;
let tcNumber: string;
let loginPageContent;
let loginPageTCData;
let tcUserName: string;
let tcPassword: string;

excelFilePath = 'SauceDemoData.xlsx';
sheetName = 'Login Page Content';
sheetName1 = 'Login Page TC Data';
loginPageContentMap = {};

test.describe('Login Page', () => {

  test.beforeAll(async ({ browser }) => {
   let jsonData = await commonUtil.readJson('./excelDetails.json');
   console.log("jsonData", jsonData)
    excelUtil = new ExcelUtil();
    commonUtil = new CommonUtil();
    loginPageContent = await excelUtil.readExcel(jsonData.LoginPageContent.ExcelWorkBook, jsonData.LoginPageContent.ExcelWorkSheet);
    loginPageContent.forEach((row: { Attribute: string; Value: string }) => {
      loginPageContentMap[row.Attribute.trim()] = row.Value.trim();
    });
    loginPageTCData = await excelUtil.readExcel(jsonData.LoginPageTCData.ExcelWorkBook, jsonData.LoginPageTCData.ExcelWorkSheet);
    context = await browser.newContext();
    page = await context.newPage();
    loginPageObj = new LoginPage(page);
  });

  test.afterAll(async () => {
    await context.close();
  });

  test(`TC1 - Check the content in login page`, async ({ }, testInfo) => {
    // console.log(`Running test for: ${testInfo.project.name}`);
    await loginPageObj.gotoLoginPage();
    await expect(page).toHaveURL('/');
    // if (testInfo.project.name.includes('Mobile')) {
    //   await expect.soft(loginPageObj.logoText).toHaveText(loginPageContentMap['Page Title Mobile']);
    // } else {
    await expect.soft(loginPageObj.logoText).toHaveText(loginPageContentMap['Page Title']);
    await expect.soft(loginPageObj.usernameInput).toHaveAttribute('placeholder', loginPageContentMap['User Name Placeholder']);
    await expect.soft(loginPageObj.passwordInput).toHaveAttribute('placeholder', loginPageContentMap['Password Placeholder']);
    await expect.soft(loginPageObj.loginButton).toHaveAttribute('value', loginPageContentMap['Login Button Text']);
    await expect.soft(loginPageObj.loginButton).toHaveCSS('background-color', loginPageContentMap['Login Button Color'])
    // }
  });

  test(`TC2 - Check the dimensions of login credentials`, async () => {
    await loginPageObj.gotoLoginPage();
    let viewport = page.viewportSize();
    if (viewport) {
      let reqWidth = viewport.width * 0.7;
      await expect.soft(loginPageObj.loginWrapper).toHaveCSS('width', `${reqWidth > 780 ? 780 : reqWidth}px`)
    }
  });

  test(`TC3 - Enter the submit button without any Input Fields`, async () => {
    await loginPageObj.gotoLoginPage();
    await loginPageObj.clickLoginButton();
    await expect.soft(loginPageObj.errorMessage).toHaveText(loginPageContentMap['Error Message 1']);
  });

  test(`TC4 - Enter the submit button without Password`, async () => {
    tcNumber = await commonUtil.getTCNumber();
    loginPageTCData.forEach(tcData =>{
      if(tcNumber == tcData['Test Case number']){
        tcUserName = tcData['User Name'];
        tcPassword = tcData['Password'];
      }
    });
    await loginPageObj.gotoLoginPage();
    await loginPageObj.setUsername(tcUserName);
    await loginPageObj.clickLoginButton();
    await expect.soft(loginPageObj.errorMessage).toHaveText(loginPageContentMap['Error Message 2']);
  });

  test(`TC5 - Enter the submit button with invalid credentials`, async () => {
    tcNumber = await commonUtil.getTCNumber();
    loginPageTCData.forEach(tcData =>{
      if(tcNumber == tcData['Test Case number']){
        tcUserName = tcData['User Name'];
        tcPassword = tcData['Password'];
      }
    });
    await loginPageObj.gotoLoginPage();
    await loginPageObj.setUsername(tcUserName);
    await loginPageObj.setPassword(tcPassword);
    await loginPageObj.clickLoginButton();
    await expect.soft(loginPageObj.errorMessage).toHaveText(loginPageContentMap['Error Message 3']);
  });

});