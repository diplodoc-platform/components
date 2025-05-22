import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';
import {DOC_LEADING_PAGE_HIDDEN_URL} from '../../constants';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test.skip('Document leading page with hidden toc, search, likes', async ({page}) => {
    await page.goto(DOC_LEADING_PAGE_HIDDEN_URL);
    await expect(page).toHaveScreenshot('DocLeadingPageHidden.png');
});
