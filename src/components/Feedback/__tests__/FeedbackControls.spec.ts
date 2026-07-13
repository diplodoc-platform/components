import type {Page} from '@playwright/test';

import {expect, test} from '@playwright/test';

import {loadDocumentPage} from '../../utils';

const viewports = [{name: 'desktop'}, {name: 'mobile', width: 430, height: 932}];

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

viewports.forEach((viewport) => {
    test.describe(`FeedbackControls test on ${viewport.name} viewport`, () => {
        test.beforeEach(async ({page}) => {
            if (viewport.width && viewport.height) {
                await page.setViewportSize({width: viewport.width, height: viewport.height});
            }
        });

        const runPopupTest = async (
            page: Page,
            buttonIdx: number,
            testName: string,
            isDefault?: boolean,
        ) => {
            const controls = page.locator('.dc-feedback__controls');
            const button = controls.locator('button').nth(buttonIdx);

            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await expect(button).toBeInViewport();

            if (isDefault) {
                await expect(page).toHaveScreenshot(
                    `FeedbackControls-${viewport.name}-scrolled.png`,
                    {
                        maxDiffPixelRatio: 0.02,
                    },
                );
            }

            await button.click();
            await expect(
                page.locator('.dc-feedback__success-popup, .dc-feedback__variants-popup').first(),
            ).toBeVisible();

            await expect(page).toHaveScreenshot(`${testName}-${viewport.name}-popup.png`, {
                maxDiffPixelRatio: 0.02,
            });
        };

        test('SuccessPopup test', async ({page}) => {
            await runPopupTest(page, 0, 'SuccessPopup', true);
        });

        test('DislikeVariantsPopup test', async ({page}) => {
            await runPopupTest(page, 1, 'DislikeVariantsPopup');
        });

        test('FeedbackFormPopup test', async ({page}) => {
            await runPopupTest(page, 2, 'FeedbackFormPopup');
        });
    });
});
