import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
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
