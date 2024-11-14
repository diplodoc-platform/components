import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('MiniToc navigation test', async ({page}) => {
    await page.getByRole('link', {name: 'Yandex Object Storage'}).click();
    await expect(page).toHaveScreenshot('MiniToc navigation.png');
});
