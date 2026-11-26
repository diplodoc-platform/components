import {expect, test} from '@playwright/test';

import {ERROR_PAGE_URL} from '../../constants';
import {loadDocumentPage} from '../../utils';

test('ErrorPage test', async ({page}) => {
    await loadDocumentPage(page, ERROR_PAGE_URL);

    const description = page.locator('.ErrorPage__description');
    const links = description.locator('a');
    const receiveAccessLink = links.nth(1);

    await expect(receiveAccessLink).toHaveAttribute('href', 'access');

    await expect(page).toHaveScreenshot('ErrorPage-default.png', {
        maxDiffPixelRatio: 0.02,
    });
});

test('keeps the 404 home link inside the description when parsing HTML', async ({page}) => {
    const url = new URL(ERROR_PAGE_URL);
    url.searchParams.set('args', 'ErrorCode:404');
    await loadDocumentPage(page, url.href);

    const errorPage = page.locator('.ErrorPage');
    await expect(errorPage.locator('.ErrorPage__code')).toContainText('404');

    const homeHref = await errorPage.evaluate((element) => {
        const parsed = new DOMParser().parseFromString(element.outerHTML, 'text/html');
        return parsed.querySelector('.ErrorPage__description a')?.getAttribute('href');
    });

    expect(homeHref).toBe('/');
});
