import {expect, test} from '@playwright/test';

import {CUSTOM_FOOTER_URL} from '../../../constants';
import {loadDocumentPage} from '../../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page, CUSTOM_FOOTER_URL);
});

test('CustomFooter test', async ({page}) => {
    const footer = page.locator('.dc-footer');
    const desktopFooter = footer.locator('.dc-footer__desktop');
    const telegramLink = desktopFooter.locator('a').filter({hasText: 'Telegram'});

    await expect(telegramLink).toHaveAttribute('href', 'https://t.me/diplodoc_ru');

    await expect(footer).toHaveScreenshot('CustomFooter-default.png', {
        maxDiffPixelRatio: 0.02,
    });
});
