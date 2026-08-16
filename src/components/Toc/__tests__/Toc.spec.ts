import {expect, test} from '@playwright/test';

import {
    DOC_PAGE_COLLAPSIBLE_TOC_URL,
    DOC_PAGE_HEADER_HIDDEN_URL,
    DOC_PAGE_HEADER_SHOWN_URL,
} from '../../constants';
import {loadDocumentPage} from '../../utils';

test.beforeEach(async ({page}) => {
    await loadDocumentPage(page);
});

test('Uses target from TOC item', async ({page}) => {
    const link = page.locator('.dc-toc a.dc-toc-item__link', {
        hasText: 'Yandex.Cloud services',
    });

    await expect(link).toHaveAttribute('target', '_self');
});

test.describe('Toc dropdown tests', () => {
    test('Hide dropdown', async ({page}) => {
        await page.getByText('Equivalent services on other platforms').click();
        await expect(page.locator('.dc-toc')).toHaveScreenshot('Hide dropdown.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('Show dropdown', async ({page}) => {
        await page.getByText('Equivalent services on other platforms').dblclick();
        await expect(page.locator('.dc-toc')).toHaveScreenshot('Show dropdown.png', {
            maxDiffPixelRatio: 0.01,
        });
    });
});

test.describe('Toc header screenshot tests', () => {
    test('TOC header hidden', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_HEADER_HIDDEN_URL);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-hidden.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('TOC header shown', async ({page}) => {
        await loadDocumentPage(page, DOC_PAGE_HEADER_SHOWN_URL);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-shown.png', {
            maxDiffPixelRatio: 0.01,
        });
    });

    test('TOC header default', async ({page}) => {
        await loadDocumentPage(page);
        await expect(page.locator('.dc-toc')).toHaveScreenshot('TOC-header-default.png', {
            maxDiffPixelRatio: 0.01,
        });
    });
});

test('Collapses and expands the documentation table of contents', async ({page}) => {
    await loadDocumentPage(page, DOC_PAGE_COLLAPSIBLE_TOC_URL);

    const layout = page.locator('.dc-doc-layout__left');
    const tocWrapper = page.locator('.dc-doc-layout__toc');
    const toc = page.locator('.dc-toc');
    const collapseButton = page.getByRole('button', {name: 'Collapse table of contents'});
    const icon = collapseButton.locator('svg');
    const tocId = await toc.getAttribute('id');

    await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    await expect(collapseButton).toHaveCSS('border-top-width', '0px');
    await expect(tocWrapper).toHaveCSS('border-right-width', '1px');
    expect(await tocWrapper.evaluate((element) => element.getBoundingClientRect().bottom)).toBe(
        await page.evaluate(() => window.innerHeight),
    );
    expect(tocId).toBeTruthy();
    await expect(collapseButton).toHaveAttribute('aria-controls', tocId || '');
    await expect(layout).toHaveCSS('width', '276px');
    await expect(icon).toHaveAttribute('viewBox', '0 0 8 8');
    await expect(icon.locator('path')).toHaveAttribute(
        'd',
        'm.72 7.64 6.39-3.2a.5.5 0 0 0 0-.89L.72.36A.5.5 0 0 0 0 .81v6.38c0 .37.4.61.72.45Z',
    );

    await collapseButton.click();

    const expandButton = page.getByRole('button', {name: 'Expand table of contents'});
    await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    await expect(layout).toHaveCSS('width', '56px');
    await expect(toc).toBeHidden();

    await expandButton.click();

    await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');
    await expect(layout).toHaveCSS('width', '276px');
    await expect(toc).toBeVisible();
});

test('Keeps the table of contents available after resizing to mobile', async ({page}) => {
    await loadDocumentPage(page, DOC_PAGE_COLLAPSIBLE_TOC_URL);

    const toc = page.locator('.dc-toc');
    const collapseButton = page.getByRole('button', {name: 'Collapse table of contents'});

    await collapseButton.click();
    await expect(toc).toBeHidden();

    await page.setViewportSize({width: 375, height: 800});

    await expect(page.getByRole('button', {name: 'Expand table of contents'})).toBeHidden();
    await expect(toc).toHaveCSS('display', 'flex');
});

test('Does not show the collapse button without a change handler', async ({page}) => {
    await loadDocumentPage(page);

    await expect(page.locator('.dc-doc-layout__toc-collapse-button')).toHaveCount(0);
});

test('Preserves the mobile navigation transition with reduced motion', async ({page}) => {
    await page.emulateMedia({reducedMotion: 'reduce'});
    await loadDocumentPage(page, DOC_PAGE_COLLAPSIBLE_TOC_URL);

    const layout = page.locator('.dc-doc-layout__left');

    await expect(layout).toHaveCSS('transition-property', 'none');

    await page.setViewportSize({width: 375, height: 800});

    await expect(layout).toHaveCSS('transition-property', 'left');
});
