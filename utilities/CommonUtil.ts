/** 
 * Common Utility
 * 
 * This utility provides common functions that can be utilized in all other utilities.
 * 
 */

import test from "@playwright/test";
import * as fs from 'fs';

export class CommonUtil {

    async getTestCaseName(): Promise<string> {
        return test.info().title;
    }

    async getFirstWordInTCName(name: string): Promise<string> {
        return name.split(" ")[0];
    }

    async getTCNumberFromName(name: string): Promise<string> {
        return name.replace(/^TC/, '');
    }

    async getTCNumber(): Promise<string> {
        let tcName: string;
        let tcFirstWord: string;
        let tcNumber: string;

        tcName = await this.getTestCaseName();
        tcFirstWord = await this.getFirstWordInTCName(tcName);
        tcNumber = await this.getTCNumberFromName(tcFirstWord);
        return tcNumber;
    }

    async readJson(jsonPath: string) {
        let rawData: string;
        let jsonData;

        rawData = fs.readFileSync(jsonPath, 'utf-8');
        jsonData = JSON.parse(rawData);
        return jsonData;
    }
}

exports = { CommonUtil };