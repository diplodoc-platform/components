import {expect, test} from '@playwright/test';

import {TAGS_MOBILE_URL, TAGS_URL} from '../../constants';
import {loadDocumentPage} from '../../utils';

test('renders public tags as search links', async ({page}) => {
    await loadDocumentPage(page, TAGS_URL);
    const tags = page.locator('.dc-tags');

    await expect(tags.getByText('_internal')).toHaveCount(0);
    await expect(tags.getByRole('link', {name: 'Diplodoc'})).toHaveCount(1);
    await expect(tags.getByRole('link', {name: 'Diplodoc'})).toHaveAttribute(
        'href',
        '/_search/ru/?tags=Diplodoc',
    );
    await expect(tags).toHaveScreenshot('Tags.png', {maxDiffPixelRatio: 0.01});
});

test('renders tags on mobile', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, TAGS_MOBILE_URL);

    await expect(page.locator('.dc-tags')).toHaveScreenshot('Tags-mobile.png', {
        maxDiffPixelRatio: 0.01,
    });
});
