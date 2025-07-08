import {expect, test} from '@playwright/test';

import {DOC_PAGE_HEADER_HIDDEN_URL, DOC_PAGE_HEADER_SHOWN_URL} from 'src/components/constants';

import {loadDocumentPage} from '../../utils';

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

test.describe('Toc header screenshot tests', () => {
    test('TOC header hidden', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_HEADER_HIDDEN_URL);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-hidden.png');
    });

    test('TOC header shown', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_HEADER_SHOWN_URL);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-shown.png');
    });

    test('TOC header default', async ({page}) => {
        await loadDocumentPage(page);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-default.png');
    });
});
