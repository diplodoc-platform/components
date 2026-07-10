import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';
import {DOC_LEADING_PAGE_HIDDEN_URL, DOC_LEADING_PAGE_URL} from '../../constants';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Uses target from leading page link', async ({page}) => {
    await page.goto(DOC_LEADING_PAGE_URL);

    const link = page.locator('.dc-doc-leading-page__links-link', {
        hasText: 'Пошаговые инструкции',
    });

    await expect(link).toHaveAttribute('target', '_self');
});

test.skip('Document leading page with hidden toc, search, likes', async ({page}) => {
    await page.goto(DOC_LEADING_PAGE_HIDDEN_URL);
    await expect(page).toHaveScreenshot('DocLeadingPageHidden.png');
});
