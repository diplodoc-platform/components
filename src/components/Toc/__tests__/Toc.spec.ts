import {expect, test} from '@playwright/test';

import {DOC_PAGE_HEADER_HIDDEN_URL, DOC_PAGE_HEADER_SHOWN_URL} from '../../constants';
import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Uses target from TOC item', async ({page}) => {
    const link = page.locator('.dc-toc a.dc-toc-item__link', {
        hasText: 'Yandex.Cloud services',
    });

    await expect(link).toHaveAttribute('target', '_self');
});

test.describe('Toc dropdown tests', () => {
    test('Hide dropdown', async ({page}) => {
        await page.getByText('Equivalent services on other platforms').click();
        await expect(page.locator('.dc-toc')).toHaveScreenshot('Hide dropdown.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('Show dropdown', async ({page}) => {
        await page.getByText('Equivalent services on other platforms').dblclick();
        await expect(page.locator('.dc-toc')).toHaveScreenshot('Show dropdown.png', {
            maxDiffPixelRatio: 0.01,
        });
    });
});

test.describe('Toc header screenshot tests', () => {
    test('TOC header hidden', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_HEADER_HIDDEN_URL);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-hidden.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('TOC header shown', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_HEADER_SHOWN_URL);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-shown.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('TOC header default', async ({page}) => {
        await loadDocumentPage(page);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-default.png', {
            maxDiffPixelRatio: 0.01,
        });
    });
});
