import {expect, test} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from '../constants';

test.beforeEach(async ({page}) => {
    await page.goto(DOC_PAGE_URL);
    await page.waitForSelector(ROOT_ELEMENT_SELECTOR);
});

test('Document page test', async ({page}) => {
    await expect(page).toHaveScreenshot('DocPage.png');
});
