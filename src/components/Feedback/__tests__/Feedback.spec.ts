import {expect, test} from '@playwright/test';

import {DOC_PAGE_FEEDBACK_HIDDEN_URL, DOC_PAGE_FEEDBACK_SHOWN_URL} from 'src/components/constants';

import {loadDocumentPage} from '../../utils';

test.describe('Feedback presence tests', () => {
    test('Feedback hidden', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_FEEDBACK_HIDDEN_URL);

        const feedback = page.locator('.dc-doc-page__feedback');
        await expect(feedback).toHaveCount(0);
    });

    test('Feedback shown', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_FEEDBACK_SHOWN_URL);

        const feedback = page.locator('.dc-doc-page__feedback');
        await expect(feedback).toHaveCount(1);
    });

    test('Feedback default', async ({page}) => {
        await loadDocumentPage(page);

        const feedback = page.locator('.dc-doc-page__feedback');
        await expect(feedback).toHaveCount(1);
    });
});
