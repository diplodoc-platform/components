import {expect, test} from '@playwright/test';

import {SEARCH_SUGGEST_URL} from 'src/components/constants';
import {loadDocumentPage} from 'src/components/utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page, SEARCH_SUGGEST_URL);
});

test('SearchSuggest test', async ({page}) => {
    const searchSuggest = page.locator('.dc-search-suggest__wrapper');
    const input = searchSuggest.locator('input.g-text-input__control_type_input');

    await expect(page).toHaveScreenshot('SearchSuggest-default.png', {
        maxDiffPixelRatio: 0.01,
    });

    await input.fill('test');

    await expect(page).toHaveScreenshot('SearchSuggest-search.png', {
        maxDiffPixelRatio: 0.01,
    });

    await page.locator('body').click();

    await expect(page).toHaveScreenshot('SearchSuggest-out.png', {
        maxDiffPixelRatio: 0.01,
    });
});
