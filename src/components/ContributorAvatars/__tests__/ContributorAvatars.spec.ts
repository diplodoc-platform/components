import {expect, test} from '@playwright/test';

import {loadDocumentPage} from 'src/components/utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('ContributorAvatars test', async ({page}) => {
    const contributorsBlock = page.locator('.dc-doc-page__page-contributors');
    const avatar = contributorsBlock
        .locator('.dc-contributor-avatars__displayed_avatars')
        .locator('a')
        .nth(0);
    const hiddenAvatars = contributorsBlock.locator('.dc-contributor-avatars__hidden_avatars');
    const box = await contributorsBlock.boundingBox();

    await expect(contributorsBlock).toHaveScreenshot('ContributorAvatars.png', {
        maxDiffPixelRatio: 0.03,
    });

    if (!box) {
        throw new Error('contributorsBlock not found');
    }

    const clip = {
        x: Math.max(box.x, 0),
        y: Math.max(box.y, 0),
        width: box.width,
        height: box.height + 130,
    };

    await avatar.hover();
    await expect(page).toHaveScreenshot('Avatar-popup.png', {
        clip,
        maxDiffPixelRatio: 0.03,
    });

    await hiddenAvatars.click();
    await expect(page).toHaveScreenshot('HiddenAvatars-popup.png', {
        clip,
        maxDiffPixelRatio: 0.03,
    });
});
