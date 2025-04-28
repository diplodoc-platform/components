import {Page} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from './constants';

export async function loadDocumentPage(page: Page) {
    await page.goto(DOC_PAGE_URL);
    await page.waitForSelector(ROOT_ELEMENT_SELECTOR);
}

export async function scrollDocumentPage(page: Page, y: number) {
    await page.evaluate((y) => {
        window.scrollTo(0, y);
    }, y);
    await page.waitForTimeout(100);
}
