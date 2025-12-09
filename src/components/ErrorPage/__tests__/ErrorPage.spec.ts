import {expect, test} from '@playwright/test';

import {ERROR_PAGE_URL} from 'src/components/constants';
import {loadDocumentPage} from 'src/components/utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page, ERROR_PAGE_URL);
});

test('ErrorPage test', async ({page}) => {
    const description = page.locator('.ErrorPage__description');
    const links = description.locator('a');
    const receiveAccessLink = links.nth(1);

    await expect(receiveAccessLink).toHaveAttribute('href', 'access');

    await expect(page).toHaveScreenshot('ErrorPage-default.png', {
        maxDiffPixelRatio: 0.02,
    });
});