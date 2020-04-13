const moment = require('moment');
const path = require('path');
const fs = require("fs-extra");
import ReportEvents from '@rpii/wdio-report-events' ;
let eventReporter = new ReportEvents();
import {Element, BrowserObject } from "@wdio/sync";
export {Element, BrowserObject } from "@wdio/sync";
//import refetchElement from 'node_modules/webdriverio/build/utils/refetchElement';


class Commands {

    logMessage(message: string): any {
        eventReporter.logMessage(message);
        return browser;
    };

    logScreenshot(message: string): any {
        const timestamp = moment().format('YYYYMMDD-HHmmss.SSS');
        fs.ensureDirSync('reports/html-reports/screenshots/');
        const filepath = path.join('reports/html-reports/screenshots/', timestamp + '.png');
        browser.saveScreenshot(filepath);
        eventReporter.logMessage(message);
        eventReporter.logScreenshot(filepath);
        return browser;
    };

    //Selector commands

    setCheckBox(state: boolean): any {
        // @ts-ignore
        if (this.isSelected() !== state) {
            // @ts-ignore
            this.click();
        }
        return this;
    };

    isDisplayedWithin(timeout?: number | undefined): boolean {
        try {
            // @ts-ignore
            return this.waitForDisplayed({timeout: timeout});
        } catch (err) {
            return false;
        }
    };

    waitForExistAndClick(timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForExist({timeout: timeout})) {
            // @ts-ignore
            this.scrollIntoView();
            // @ts-ignore
            this.click();
        }
        return this;
    };

    waitForDisplayedAndClick(timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForDisplayed({timeout: timeout})) {
            // @ts-ignore
            this.scrollIntoView();
            // @ts-ignore
            this.click();
        }
        return this;
    };

    waitForEnabledAndClick(timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForEnabled({timeout: timeout})) {
            // @ts-ignore
            this.scrollIntoView();
            // @ts-ignore
            this.click();
        }
        return this;
    };
    waitForExistAndSetValue(value: any, timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForExist({timeout: timeout})) {
            // @ts-ignore
            this.scrollIntoView();
            // @ts-ignore
            this.setValue(value);
        }
        return this;
    };

    waitForExistAndSelectByValue(value: any, timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForExist({timeout: timeout})) {
            // @ts-ignore
            this.selectByValue(value);
        }
        return this;
    };

    waitForDisplayedAndSetValue(value: string, timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForDisplayed({timeout: timeout})) {
            // @ts-ignore
            this.setValue(value);
        }
        return this;
    };

    waitForEnabledAndSetValue(value: string, timeout?: number | undefined): any {
        // @ts-ignore
        if (this.waitForEnabled({timeout: timeout})) {
            // @ts-ignore
            this.setValue(value);
        }
        return this;
    };
    waitForNotExist(timeout?: number | undefined): any {
        // @ts-ignore
        this.waitForExist({timeout: timeout, reverse: true});
        return this;
    };

    waitForNotDisplayed(timeout?: number | undefined): any {
        // @ts-ignore
        this.waitForDisplayed({timeout: timeout, reverse: true});
        return this;
    };

    trimText(text: string | number): string {
        text = (typeof text === 'number')
            ? text.toString()
            : text;
        return text
            .trim() // strip leading and trailing white-space characters
            .replace(/\s+/, ' ') // replace sequences of whitespace characters by a single space
    };

    waitUntilTextBecomes(text: string | RegExp, timeout?: number | undefined): boolean {
        let value: string;
        try {
            let fn = (text instanceof RegExp)
                ? (value: string) => {
                    return text.test(value);
                }
                : (value: string) => {
                    return text.localeCompare(value) == 0;
                };
            // @ts-ignore
            browser.waitUntil(async () => {
                // @ts-ignore
                try {
                    //trick, reevaluate selector to prevent stale element
                    // @ts-ignore
                    value = await $(this.selector).getText();
                } catch (error) {
                    if (error.name === 'stale element reference') {
                        //TODO research how to fix fix this
                        // const element = await refetchElement(this, commandName)
                        // @ts-ignore
                        // value =  await $(this.selector).getText();
                        console.error("'stale element reference:" + this.selector);
                    } else {
                        throw error;
                    }
                }
                return fn(value);
            }, {timeout:  timeout});
            return true;
        } catch (ex) {
            console.log(ex);
        }
        return false;
    };

    // setValue(value:string ) {
    //      const webBrowser = browser.capabilities.browserName.toLowerCase();
    //
    //      if (webBrowser === 'microsoftedge') {
    //          browser.execute((el, val) => {
    //              const regex = /\'(.*)\'/; // pulls name out of xpath
    //              const extractedName = el.match(regex)[1];
    //
    //              document.getElementsByName(extractedName)[0].focus();
    //              document.getElementsByName(extractedName)[0].value = val;
    //              // @ts-ignore
    //          }, $(this.selector), value);
    //      }
    //      else {
    //          this.setValue(value);
    //      }
    //  });

    public addCommands(browser: WebdriverIO.BrowserObject) {

        browser.addCommand('logMessage', this.logMessage);
        browser.addCommand('logScreenshot', this.logScreenshot);

        //Selector commands
        browser.addCommand('setCheckBox', this.setCheckBox, true);
        browser.addCommand('isDisplayedWithin', this.isDisplayedWithin, true);
        browser.addCommand('waitForExistAndClick', this.waitForExistAndClick, true);
        browser.addCommand('waitForDisplayedAndClick', this.waitForDisplayedAndClick, true);
        browser.addCommand('waitForEnabledAndClick', this.waitForDisplayedAndClick, true);
        browser.addCommand('waitForExistAndSetValue', this.waitForExistAndSetValue, true);
        browser.addCommand('waitForExistAndSelectByValue', this.waitForExistAndSelectByValue, true);
        browser.addCommand('waitForDisplayedAndSetValue', this.waitForDisplayedAndSetValue, true);
        browser.addCommand('waitForEnabledAndSetValue', this.waitForDisplayedAndSetValue, true);
        browser.addCommand('waitForNotExist', this.waitForNotExist, true);
        browser.addCommand('waitForNotDisplayed', this.waitForNotDisplayed, true);
        browser.addCommand('waitUntilTextBecomes', this.waitUntilTextBecomes, true);
        // browser.addCommand('setInputValue', function(element, value) ;

    }
}

export default new Commands();