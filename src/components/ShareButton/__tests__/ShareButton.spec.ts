import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';
import {DOC_PAGE_MOBILE_URL} from '../../constants';

type ShareWindow = typeof window & {
    sharedUrl?: string;
    copiedText?: string;
};

const SHARE_BUTTON_SELECTOR = '.dc-share-button';
const COPIED_HINT_SELECTOR = '.dc-share-button__tooltip';

test.describe('ShareButton test', () => {
    // the share button lives in the mobile sub navigation, hidden on wider screens
    test.use({viewport: {width: 375, height: 812}});

    test('Shares the link when the Web Share API is available', async ({page}) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'share', {
                configurable: true,
                value: (data: {url: string}) => {
                    (window as ShareWindow).sharedUrl = data.url;

                    return Promise.resolve();
                },
            });
        });

        await loadDocumentPage(page, DOC_PAGE_MOBILE_URL);

        await page.locator(SHARE_BUTTON_SELECTOR).first().click();

        await expect
            .poll(() => page.evaluate(() => (window as ShareWindow).sharedUrl))
            .toBe(page.url());
        await expect(page.locator(COPIED_HINT_SELECTOR)).toHaveCount(0);
    });

    test('Copies the link when the Web Share API is unavailable', async ({page}) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'share', {
                configurable: true,
                value: undefined,
            });
            Object.defineProperty(navigator, 'clipboard', {
                configurable: true,
                value: {
                    writeText: (value: string) => {
                        (window as ShareWindow).copiedText = value;

                        return Promise.resolve();
                    },
                },
            });
        });

        await loadDocumentPage(page, DOC_PAGE_MOBILE_URL);

        await page.locator(SHARE_BUTTON_SELECTOR).first().click();

        await expect
            .poll(() => page.evaluate(() => (window as ShareWindow).copiedText))
            .toBe(page.url());
        await expect(page.locator(COPIED_HINT_SELECTOR)).toHaveText('Link copied');
    });

    test('Reports a failure when the clipboard is not available either', async ({page}) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'share', {
                configurable: true,
                value: undefined,
            });
            Object.defineProperty(navigator, 'clipboard', {
                configurable: true,
                value: undefined,
            });
            Object.defineProperty(document, 'execCommand', {
                configurable: true,
                value: () => false,
            });
        });

        await loadDocumentPage(page, DOC_PAGE_MOBILE_URL);

        await page.locator(SHARE_BUTTON_SELECTOR).first().click();

        await expect(page.locator(COPIED_HINT_SELECTOR)).toHaveText("Couldn't copy the link");
    });
});
