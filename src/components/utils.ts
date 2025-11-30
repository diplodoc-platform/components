import type {Page} from '@playwright/test';

import {DOC_PAGE_URL, ROOT_ELEMENT_SELECTOR} from './constants';

export async function loadDocumentPage(page: Page, url?: string) {
    const targetUrl = url || DOC_PAGE_URL;
    if (process.env.IS_DOCKER) {
        console.log(`[TEST] Attempting to load page: ${targetUrl}`);
    }
    
    try {
        // Use 'load' instead of 'networkidle' - it's more reliable in Docker
        // 'networkidle' can timeout if there are long-running network requests
        await page.goto(targetUrl, {
            waitUntil: 'load',
            timeout: 60000, // 60 seconds timeout for container environments
        });
        
        if (process.env.IS_DOCKER) {
            console.log(`[TEST] Page loaded, waiting for root element...`);
        }
        
        await page.waitForSelector(ROOT_ELEMENT_SELECTOR, {
            timeout: 30000, // 30 seconds timeout for selector
        });
        
        if (process.env.IS_DOCKER) {
            console.log(`[TEST] Root element found: ${ROOT_ELEMENT_SELECTOR}`);
        }
    } catch (error) {
        if (process.env.IS_DOCKER) {
            console.error(`[TEST] Error loading page: ${error}`);
            console.error(`[TEST] Target URL was: ${targetUrl}`);
            console.error(`[TEST] Current page URL: ${page.url()}`);
        }
        throw error;
    }
}
