import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Document page test', async ({page}) => {
    await expect(page).toHaveScreenshot('DocPage.png');
});
