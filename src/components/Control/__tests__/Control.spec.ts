import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Control test', async ({page}) => {
    const controls = page.locator('.dc-doc-page__controls');
    const control = controls.locator('button').nth(3);

    const box = await controls.boundingBox();

    if (!box) {
        throw new Error('controls not found');
    }

    const clip = {
        x: Math.max(box.x, 0),
        y: Math.max(box.y - 20, 0),
        width: box.width + 200,
        height: box.height + 30,
    };

    await control.hover();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('Control.png', {clip});
});
