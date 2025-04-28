import {expect, test} from '@playwright/test';

import {loadDocumentPage, scrollDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Document page test', async ({page}) => {
    await expect(page).toHaveScreenshot('DocPage.png');
});

test('Document page scroll test', async ({page}) => {
    await scrollDocumentPage(page, 400);
    await expect(page).toHaveScreenshot('DocPage_scroll.png');
});
