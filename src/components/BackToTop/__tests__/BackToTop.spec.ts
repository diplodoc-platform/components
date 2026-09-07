import {expect, test} from '@playwright/test';

import {BACK_TO_TOP_URL} from '../../constants';
import {loadDocumentPage} from '../../utils';

const BUTTON = '.dc-back-to-top';

test('appears after scrolling down', async ({page}) => {
    await loadDocumentPage(page, BACK_TO_TOP_URL);

    await expect(page.locator(BUTTON)).toBeHidden();

    await page.mouse.wheel(0, 1000);

    await expect(page.locator(BUTTON)).toBeVisible();
});
