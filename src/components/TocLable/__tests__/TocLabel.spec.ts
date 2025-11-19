import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('TocLabel test', async ({page}) => {
    const label = page.locator('.g-label');
    await expect(label).toBeVisible();

    const box = await label.boundingBox();

    if (!box) {
        throw new Error('label not found');
    }

    const clip = {
        x: Math.max(box.x, 0),
        y: Math.max(box.y - 20, 0),
        width: box.width + 300,
        height: box.height + 40,
    };

    await expect(page).toHaveScreenshot('TocLabel-default.png', {
        clip,
        maxDiffPixelRatio: 0.01,
    });

    await label.hover();
    await label.click();

    await expect(page).toHaveScreenshot('TocLabel-tooltip.png', {
        clip,
        maxDiffPixelRatio: 0.01,
    });

    await page.hover('body');
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('TocLabel-hover-out.png', {
        clip,
        maxDiffPixelRatio: 0.01,
    });
});
