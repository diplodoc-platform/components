import {expect, test} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from '../constants';

test.beforeEach(async ({page}) => {
    await page.goto(DOC_PAGE_URL);
    await page.waitForSelector(ROOT_ELEMENT_SELECTOR);
});

test('MiniToc navigation test', async ({page}) => {
    await page.getByRole('link', {name: 'Yandex Object Storage'}).click();
    await expect(page).toHaveScreenshot('MiniToc navigation.png');
});
