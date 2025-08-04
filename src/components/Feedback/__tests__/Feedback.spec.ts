import {expect, test} from '@playwright/test';

import {DOC_PAGE_FEEDBACK_HIDDEN_URL, DOC_PAGE_FEEDBACK_SHOWN_URL} from 'src/components/constants';

import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
});

test.describe('Feedback screenshot tests', () => {
    test('Feedback hidden', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_FEEDBACK_HIDDEN_URL);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot('feedback-hidden.png', {
            fullPage: true,
            timeout: 10000,
            maxDiffPixelRatio: 0.03,
        });
    });

    test('Feedback shown', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_FEEDBACK_SHOWN_URL);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot('feedback-shown.png', {
            fullPage: true,
            timeout: 10000,
            maxDiffPixelRatio: 0.03,
        });
    });

    test('Feedback default', async ({page}) => {
        await loadDocumentPage(page);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(500);
        await expect(page).toHaveScreenshot('feedback-default.png', {
            fullPage: true,
            timeout: 10000,
            maxDiffPixelRatio: 0.03,
        });
    });
});
