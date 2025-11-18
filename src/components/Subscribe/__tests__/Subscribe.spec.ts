import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Subscribe test', async ({page}) => {
    const subscribeControl = page.locator('[aria-label="Subscribe"]');

    await subscribeControl.click();
    await page.hover('body');

    const popup = page.locator('.dc-subscribe__variants-popup');

    await expect(popup).toBeVisible();
    await expect(page).toHaveScreenshot('Subscribe-variants-popup.png', {
        maxDiffPixelRatio: 0.04,
    });

    const email = popup.locator('.g-text-input__control');
    const subscribeButton = popup.locator('.dc-subscribe__variants-action');

    await email.fill('test@email.ru');
    await subscribeButton.click();

    await expect(page).toHaveScreenshot('Subscribe-success-popup.png', {
        maxDiffPixelRatio: 0.04,
    });
});
