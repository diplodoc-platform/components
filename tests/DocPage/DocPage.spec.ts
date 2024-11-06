import {expect, test} from '@playwright/test';

import {ROOT_ELEMENT_SELECTOR, URL_SEGMENT, VIEW_MODE} from '../utils';

test('Document page test', async ({page}) => {
    await page.goto(URL_SEGMENT + 'pages-document--document' + VIEW_MODE);
    await page.waitForSelector(ROOT_ELEMENT_SELECTOR);
    await expect(page).toHaveScreenshot('DocPage.png');
});
