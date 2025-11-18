import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';
import {DOC_PAGE_HIDDEN_URL} from '../../constants';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Document page test', async ({page}) => {
    await expect(page).toHaveScreenshot('DocPage.png', {
        maxDiffPixelRatio: 0.04,
    });
});

test.skip('Document page with hidden toc, search, likes', async ({page}) => {
    await page.goto(DOC_PAGE_HIDDEN_URL);
    await expect(page).toHaveScreenshot('DocPageHidden.png');
});
