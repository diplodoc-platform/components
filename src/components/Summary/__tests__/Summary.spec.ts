import {expect, test} from '@playwright/test';

import {
    DOC_PAGE_SUMMARY_MOBILE_URL,
    DOC_PAGE_SUMMARY_ONLY_MOBILE_URL,
    SUMMARY_MOBILE_URL,
    SUMMARY_URL,
} from '../../constants';
import {loadDocumentPage} from '../../utils';

test('renders summary with predictable spacing', async ({page}) => {
    await loadDocumentPage(page, SUMMARY_URL);

    const summary = page.locator('.dc-summary');
    const text = summary.locator('p');

    await expect(text).toHaveText(
        'A short summary that describes the page and helps readers understand what they will find inside.',
    );
    await expect(text).toHaveCSS('margin-top', '0px');
    await expect(text).toHaveCSS('margin-bottom', '0px');
    await expect(summary).toHaveScreenshot('Summary.png', {maxDiffPixelRatio: 0.01});
});

test('renders summary on mobile', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, SUMMARY_MOBILE_URL);

    await expect(page.locator('.dc-summary')).toHaveScreenshot('Summary-mobile.png', {
        maxDiffPixelRatio: 0.01,
    });
});

test('keeps the mobile mini toc scrollable with summary', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, DOC_PAGE_SUMMARY_MOBILE_URL);

    const panel = page.locator('.dc-subnavigation__mini-toc');
    const sections = panel.locator('.dc-mini-toc__sections');

    await page.locator('.dc-subnavigation__mini-toc-button').click();
    await expect(panel).toHaveClass(/dc-subnavigation__mini-toc_open/);
    await panel.evaluate(
        (element) =>
            new Promise<void>((resolve) => {
                element.addEventListener('transitionend', () => resolve(), {once: true});
            }),
    );
    await expect(sections).toHaveClass(/dc-mini-toc_overflowed/);

    const panelDimensions = await panel.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
    }));
    const sectionsDimensions = await sections.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
    }));

    expect(panelDimensions.scrollHeight).toBeLessThanOrEqual(panelDimensions.clientHeight + 1);
    expect(sectionsDimensions.scrollHeight).toBeGreaterThan(sectionsDimensions.clientHeight);
    await expect(panel.locator('.dc-mini-toc')).toHaveScreenshot('Summary-mini-toc-mobile.png', {
        maxDiffPixelRatio: 0.01,
    });
});

for (const headingCount of [0, 1]) {
    test(`renders only summary with ${headingCount} headings`, async ({page}) => {
        await page.setViewportSize({width: 390, height: 320});
        await loadDocumentPage(
            page,
            `${DOC_PAGE_SUMMARY_ONLY_MOBILE_URL}&args=HeadingCount:${headingCount}`,
        );

        const panel = page.locator('.dc-subnavigation__mini-toc');
        await page.locator('.dc-subnavigation__mini-toc-button').click();

        const miniToc = panel.locator('.dc-mini-toc');
        const summary = panel.locator('.dc-summary');

        await expect(miniToc).toHaveClass(/dc-mini-toc_summary-only/);
        await expect(summary).toHaveCSS('margin-bottom', '0px');
        await expect(summary.locator('.dc-summary__text')).toHaveText(
            'Короткое описание статьи "О нас"',
        );
        await expect(summary.locator('.dc-summary__text')).toHaveCSS('text-wrap', 'balance');
        await expect(panel.locator('.dc-mini-toc__sections')).toHaveCount(0);
    });
}

test('renders mini toc sections with 2 headings', async ({page}) => {
    await page.setViewportSize({width: 390, height: 320});
    await loadDocumentPage(page, `${DOC_PAGE_SUMMARY_ONLY_MOBILE_URL}&args=HeadingCount:2`);

    const panel = page.locator('.dc-subnavigation__mini-toc');
    await page.locator('.dc-subnavigation__mini-toc-button').click();

    await expect(panel.locator('.dc-mini-toc')).not.toHaveClass(/dc-mini-toc_summary-only/);
    expect(await panel.locator('.dc-mini-toc__section').count()).toBeGreaterThanOrEqual(2);
});
