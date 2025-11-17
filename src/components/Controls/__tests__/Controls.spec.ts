import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test.describe('Controls test', () => {
    test('SettingsControl test', async ({page}) => {
        const controls = page.locator('.dc-doc-page__controls');
        const control = controls.locator('button').nth(1);

        await control.click();
        await page.hover('body');

        await expect(page).toHaveScreenshot('SettingsControl-default.png');

        const label = page.locator('[title="Wide format"]');

        await label.click();

        await expect(page).toHaveScreenshot('SettingsControl-clicked.png');
    });

    test('LangControl test', async ({page}) => {
        const controls = page.locator('.dc-doc-page__controls');
        const control = controls.locator('button').nth(2);

        await control.click();
        await page.hover('body');

        await expect(page).toHaveScreenshot('LangControl-default.png');
    });
});
