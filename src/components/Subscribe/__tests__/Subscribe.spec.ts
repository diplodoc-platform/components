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
        maxDiffPixelRatio: 0.01,
    });

    const email = popup.locator('.g-text-input__control');
    const subscribeButton = popup.locator('.dc-subscribe__variants-action');
    const consentCheckbox = popup.locator('.dc-subscribe__consent input[type="checkbox"]');

    await email.fill('test@email.ru');
    await consentCheckbox.check();

    await subscribeButton.click();

    await expect(page).toHaveScreenshot('Subscribe-success-popup.png', {
        maxDiffPixelRatio: 0.01,
    });
});

test('Subscribe consent gating', async ({page}) => {
    const subscribeControl = page.locator('[aria-label="Subscribe"]');
    await subscribeControl.click();
    await page.hover('body');

    const popup = page.locator('.dc-subscribe__variants-popup');
    await expect(popup).toBeVisible();

    const email = popup.locator('.g-text-input__control');
    const subscribeButton = popup.locator('.dc-subscribe__variants-action');
    const consentCheckbox = popup.locator('.dc-subscribe__consent input[type="checkbox"]');

    await email.fill('test@email.ru');

    await expect(consentCheckbox).toBeVisible();
    await expect(subscribeButton).toBeDisabled();

    await consentCheckbox.check();
    await expect(subscribeButton).toBeEnabled();

    await expect(page).toHaveScreenshot('Subscribe-variants-popup-consent.png', {
        maxDiffPixelRatio: 0.01,
    });
});
