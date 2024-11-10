import {expect, test} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from '../constants';

test.beforeEach(async ({page}) => {
    await page.goto(DOC_PAGE_URL);
    await page.waitForSelector(ROOT_ELEMENT_SELECTOR);
});

test.describe('Toc dropdown tests', () => {
    test('Hide dropdown', async ({page}) => {
        await page.getByText('Equivalent services on other platforms').click();
        await expect(page).toHaveScreenshot('Hide dropdown.png');
    });

    test('Show dropdown', async ({page}) => {
        await page.getByText('Equivalent services on other platforms').dblclick();
        await expect(page).toHaveScreenshot('Show dropdown.png');
    });
});
