import {expect, test} from '@playwright/test';

import {SEARCH_SUGGEST_WITH_AI_URL} from 'src/components/constants';
import {loadDocumentPage} from 'src/components/utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page, SEARCH_SUGGEST_WITH_AI_URL);
});

test('SearchSuggestWithAi test', async ({page}) => {
    const searchSuggest = page.locator('.dc-search-suggest__wrapper');
    const input = searchSuggest.locator('input.g-text-input__control_type_input');

    await expect(page).toHaveScreenshot('SearchSuggestWithAi-default.png', {
        maxDiffPixelRatio: 0.01,
    });

    await input.fill('test');

    await expect(page.getByText('Ask AI').first()).toBeVisible({timeout: 5000});

    await expect(page).toHaveScreenshot('SearchSuggestWithAi-search.png', {
        maxDiffPixelRatio: 0.01,
    });

    await page.locator('body').click();

    await expect(page).toHaveScreenshot('SearchSuggestWithAi-out.png', {
        maxDiffPixelRatio: 0.01,
    });
});
