import type {Page} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from './constants';

export async function loadDocumentPage(page: Page, url?: string) {
    const targetUrl = url || DOC_PAGE_URL;

    // Use 'load' instead of 'networkidle' - more reliable in Docker containers
    await page.goto(targetUrl, {
        waitUntil: 'load',
        timeout: 60000,
    });

    await page.waitForSelector(ROOT_ELEMENT_SELECTOR, {
        timeout: 30000,
    });
}
