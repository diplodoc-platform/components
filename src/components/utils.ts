import type {Page} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from './constants';

export async function loadDocumentPage(page: Page, url?: string) {
    await page.goto(url || DOC_PAGE_URL);
    await page.waitForSelector(ROOT_ELEMENT_SELECTOR);
}
